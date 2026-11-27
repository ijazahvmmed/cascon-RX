import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import { assessment, categories, categoryResult, type ScanReport } from './model';

const width = 595.28;
const height = 841.89;
const margin = 43;
const ink = rgb(.09,.09,.09);
const muted = rgb(.32,.32,.32);
const line = rgb(.82,.82,.82);
const paper = rgb(.974,.974,.974);

function pdfText(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[—–]/g,'-')
    .replace(/·/g,' / ').replace(/[^\x20-\x7e]/g,'');
}

function wrap(value: string, font: PDFFont, size: number, max: number) {
  const rows: string[] = [];
  let row = '';
  for (let word of pdfText(value).split(/\s+/).filter(Boolean)) {
    if (row && font.widthOfTextAtSize(row + ' ' + word,size) <= max) { row += ' ' + word; continue; }
    if (row) rows.push(row);
    while (font.widthOfTextAtSize(word,size) > max) {
      let i = 1;
      while (i < word.length && font.widthOfTextAtSize(word.slice(0,i + 1),size) <= max) i++;
      rows.push(word.slice(0,i));
      word = word.slice(i);
    }
    row = word;
  }
  if (row) rows.push(row);
  return rows;
}

export async function summaryPdf(report: ScanReport) {
  const doc = await PDFDocument.create();
  doc.setTitle('Cascon Digital — Free store check');
  doc.setAuthor('Cascon Digital');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const emphasis = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([width,height]), y = height - margin;

  function text(value: string, size = 11, bold = false, color = ink, x = margin) {
    const font = bold ? emphasis : regular;
    for (const row of wrap(value,font,size,width - margin - x)) {
      page.drawText(row,{ x, y:y-size, font, size, color });
      y -= size + 5;
    }
  }

  function ensure(pixels: number) {
    if (y - pixels >= margin) return;
    page = doc.addPage([width,height]);
    y = height - margin;
    text('CASCON DIGITAL / FREE STORE CHECK',10,false,muted);
    y -= 12;
  }

  text('CASCON DIGITAL / FREE STORE CHECK',10,false,muted);
  y -= 4;
  text('Your store results',27);
  text(report.store,11,false,muted);
  text('Recorded ' + new Date(report.capturedAt).toISOString().slice(0,10) + ' UTC',10,false,muted);
  y -= 18;
  const headline = assessment(report);
  const cardTop = y, cardHeight = 105;
  page.drawRectangle({ x:margin, y:cardTop-cardHeight, width:width-2*margin, height:cardHeight, color:paper, borderColor:line, borderWidth:0.5 });
  y -= 9;
  text(headline.label,10,false,muted,margin+14);
  text(headline.value,25,false,ink,margin+14);
  text(headline.detail,10,false,muted,margin+14);
  const groups = [
    { label: 'Confirmed', count: headline.passed },
    { label: 'To fix', count: headline.issues },
    { label: 'Still open', count: headline.open },
  ];
  groups.forEach(({ label, count }, i) => {
    const x = margin + 14 + i * 154;
    page.drawText(label + '  ' + count, { x, y:y-8, size:10, font:regular, color:ink });
    for (let dot = 0; dot < headline.total; dot++) {
      const center = x + 2 + dot * 8;
      const marked = dot < count;
      const color = marked ? ink : line;
      if (i === 1 && marked) {
        page.drawRectangle({ x:center-2, y:y-20, width:4, height:4, color:muted });
      } else {
        page.drawCircle({ x:center, y:y-18, size:2, color: i === 2 && marked ? paper : color, borderColor:color, borderWidth:.6 });
      }
    }
  });
  y = cardTop - cardHeight - 14;
  text('What went into your score',14);
  for (const item of report.shopping) {
    ensure(50);
    text(item.title + '  /  ' + item.result,10,true);
    text(item.detail,9,false,muted);
  }
  ensure(80);
  y -= 11;
  text('Other store checks',14);
  for (const category of report.categories) {
    ensure(18);
    text(categories[category.category] + '  /  ' + categoryResult(category),10);
  }
  y -= 13;
  if (!report.recommendations.length) {
    ensure(60);
    text('Recommended next steps',14);
    text('We did not find a change we could confidently recommend from these pages.');
  }
  for (const [index,item] of report.recommendations.slice(0,3).entries()) {
    const paragraphs = [
      'What we found: ' + item.evidence + ' (' + item.path + ')',
      'Why it matters: ' + item.why,
      'Suggested change: ' + item.change,
      item.priority + ' priority / ' + item.effort + ' effort / ' + item.confidence + ' confidence',
    ];
    const titleHeight = 17 * wrap(item.title,emphasis,12,width-2*margin).length;
    const needed = paragraphs.reduce((sum,value) => sum + 15 * wrap(value,regular,10,width-2*margin).length,titleHeight);
    ensure(needed + 10 + (index === 0 ? 19 : 0));
    if (index === 0) text('Recommended next steps',14);
    text(item.title,12,true);
    paragraphs.forEach((value,i) => text(value,10,false,i === paragraphs.length-1 ? muted : ink));
    y -= 10;
  }
  ensure(75);
  page.drawLine({ start:{x:margin,y}, end:{x:width-margin,y}, thickness:.5,color:line });
  y -= 15;
  text('A hands-on review can show how it feels to shop on a phone and go through checkout.',9,false,muted);
  text('www.cascondigital.com/tools/cro-audit/methodology',9,false,muted);
  const pages = doc.getPages();
  pages.forEach((sheet,i) => {
    sheet.drawText((i + 1) + ' / ' + pages.length, {x:width-margin-23, y:20, size:8, font:regular, color:muted});
  });
  return doc.save();
}
