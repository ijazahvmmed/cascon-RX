import argparse
import csv
import re
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.links = set()
        self.images = []
        self.headings = []
        self.schema = set()
        self.title = ''
        self.reading_title = False
        self.schema_text = False
        self.inert = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style', 'noscript', 'template'):
            self.inert += 1
            self.schema_text = tag == 'script' and attrs.get('type') == 'application/ld+json'
        if self.inert:
            return
        if tag == 'title':
            self.reading_title = True
        elif tag == 'meta':
            key = attrs.get('name') or attrs.get('property')
            if key:
                self.meta[key.lower()] = attrs.get('content', '')
        elif tag == 'link' and attrs.get('rel') == 'canonical':
            self.meta['canonical'] = attrs.get('href', '')
        elif tag == 'a' and attrs.get('href'):
            self.links.add(attrs['href'])
        elif tag == 'img':
            self.images.append((attrs.get('src', ''), attrs.get('alt'), attrs.get('role', '')))
        elif re.fullmatch('h[1-6]', tag):
            self.headings.append(tag)

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript', 'template'):
            self.inert = max(0, self.inert - 1)
            self.schema_text = False
        if tag == 'title':
            self.reading_title = False

    def handle_data(self, data):
        if self.reading_title:
            self.title += data
        if self.schema_text:
            self.schema.update(re.findall(r'"@type"\s*:\s*"([^"]+)"', data))

def get(url, method='GET'):
    try:
        with urlopen(Request(url, headers={'User-Agent':'Cascon production SEO audit'}, method=method), timeout=14) as response:
            return response.status, response.url, response.headers, response.read() if method=='GET' else b''
    except HTTPError as error:
        return error.code, error.url, error.headers, b''
    except (URLError, OSError):
        return 0, url, {}, b''

def capture(url):
    status, final, headers, content = get(url)
    page = Page()
    page.feed(content.decode('utf-8', errors='replace'))
    return url, status, final, headers, page

def main():
    arg = argparse.ArgumentParser()
    arg.add_argument('--origin', default='https://www.cascondigital.com')
    arg.add_argument('--output', type=Path, required=True)
    arg.add_argument('--fail-on-issues', action='store_true', help='Exit nonzero when the crawl reports a finding')
    args = arg.parse_args()
    origin = args.origin.rstrip('/')
    sitemap_status, _, _, xml = get(origin + '/sitemap.xml')
    if sitemap_status != 200:
        raise SystemExit(f'Cannot read sitemap: HTTP {sitemap_status}')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = sorted({node.text for node in ET.fromstring(xml).findall('.//s:loc', ns) if node.text})
    if not urls:
        raise SystemExit('Sitemap contains no canonical URLs')
    captures = {}
    with ThreadPoolExecutor(max_workers=10) as pool:
        for item in pool.map(capture, urls):
            captures[item[0]] = item
    titles = Counter(item[-1].title.strip().casefold() for item in captures.values())
    descriptions = Counter(item[-1].meta.get('description', '').strip().casefold() for item in captures.values())
    internal = {url: {urljoin(url, href).split('#')[0] for href in item[-1].links
                      if urlsplit(urljoin(url, href)).netloc == urlsplit(origin).netloc
                      and not urlsplit(urljoin(url, href)).query}
                for url,item in captures.items()}
    reachable, frontier = set(), [origin, origin+'/']
    while frontier:
        url = frontier.pop()
        if url in reachable:
            continue
        reachable.add(url)
        frontier.extend(internal.get(url, set()) & captures.keys() - reachable)
    media = {urljoin(url,src) for url,item in captures.items() for src,_,_ in item[-1].images if src and src.startswith('/')}
    media.update(item[-1].meta['og:image'] for item in captures.values()
                 if item[-1].meta.get('og:image','').startswith(origin))
    with ThreadPoolExecutor(max_workers=8) as pool:
        media_status = dict(zip(media, pool.map(lambda u:get(u,'HEAD')[0], media)))
    destinations = {v for links in internal.values() for v in links if v not in captures and v != origin}
    with ThreadPoolExecutor(max_workers=8) as pool:
        link_status = dict(zip(destinations,pool.map(lambda u:get(u,'HEAD')[0], destinations)))
    rows = []
    for url, status, final, headers, page in captures.values():
        title = page.title.strip()
        desc = page.meta.get('description','').strip()
        missing = [src for src,alt,_ in page.images if alt is None]
        empty = [src for src,alt,_ in page.images if alt == '']
        broken = [src for src,_,_ in page.images
                  if src.startswith('/') and (media_status.get(urljoin(url,src),200) >= 400 or media_status.get(urljoin(url,src)) == 0)]
        og_image = page.meta.get('og:image','')
        links_broken = sorted(v for v in internal[url] if link_status.get(v,200) >= 400 or link_status.get(v) == 0)
        robots = ', '.join(filter(None, [page.meta.get('robots',''), page.meta.get('googlebot',''), headers.get('X-Robots-Tag','')]))
        canonical = page.meta.get('canonical','')
        findings = []
        for condition, name in [
            (status != 200,'non-200'),(final != url,'redirect'),(canonical != url,'canonical-mismatch'),
            ('noindex' in robots.lower(),'noindex'),(not title,'missing-title'),(len(title)>70,'title-over-70'),
            (bool(title) and titles[title.casefold()] > 1,'duplicate-title'),
            (title.lower().count('| cascon digital')>1,'duplicate-brand-suffix'),
            (not desc,'missing-description'),(bool(desc) and descriptions[desc.casefold()] > 1,'duplicate-description'),
            (page.headings.count('h1')!=1,'h1-count'),(not page.meta.get('og:title') or not page.meta.get('og:description') or not og_image,'missing-open-graph'),
            (bool(og_image) and (media_status.get(og_image,200)>=400 or media_status.get(og_image)==0),'broken-open-graph-image'),
            (bool(missing),'missing-alt'),(bool(broken),'broken-image'),
            (bool(links_broken),'broken-internal-link'),(url not in reachable,'orphan'),
        ]:
            if condition:
                findings.append(name)
        rows.append(dict(url=url,http_status=status,final_url=final,canonical=canonical,robots=robots,
            title=title,title_chars=len(title),description=desc,og_title=page.meta.get('og:title',''),
            og_description=page.meta.get('og:description',''),og_image=og_image,
            og_image_http=media_status.get(og_image,'not tested'),h1_count=page.headings.count('h1'),
            heading_outline=' '.join(page.headings),schema='; '.join(sorted(page.schema)),
            rendered_image_count=len(page.images),missing_alt_images='; '.join(missing),
            empty_alt_review_candidates='; '.join(empty),broken_images='; '.join(broken),
            broken_internal_links='; '.join(links_broken),server_internal_links=len(internal[url]),
            sitemap_included='yes',findings='; '.join(findings)))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('w',encoding='utf-8-sig',newline='') as fp:
        writer = csv.DictWriter(fp,fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f'{len(rows)} pages, {len(media)} same-site images/OG images, {len(destinations)} extra internal destinations')
    for row in rows:
        if row['findings']:
            print(row['url'],row['findings'],row['title_chars'])
    if args.fail_on_issues and any(row['findings'] for row in rows):
        raise SystemExit(1)

if __name__ == '__main__':
    main()
