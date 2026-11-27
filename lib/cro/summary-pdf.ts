import { assessment, categoryResult, sampleLabels } from './model';
import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import { categories, type ScanReport } from './model';

const width = 595.28;
const height = 841.89;
const margin = 43;
const ink = rgb(.09,.12,.1);
const muted = rgb(.24,.32,.27);
const line = rgb(.78,.83,.78);
const green = rgb(.88,.92,.87);

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
      page.drawText(row,{ x, y, font, size, color });
      y -= size + 5;
    }
  }

  function ensure(pixels: number) {
    if (y - pixels >= margin) return;
    page = doc.addPage([width,height]);
    y = height - margin;
    text('CASCON DIGITAL / FREE STORE CHECK',10,true,muted);
    y -= 12;
  }

  text('CASCON DIGITAL / FREE STORE CHECK',10,true,muted);
  y -= 9;
  text('Your store results',27,true);
  text(report.store,11,false,muted);
  text('Recorded ' + new Date(report.capturedAt).toISOString().slice(0,10) + ' UTC',10,false,muted);
  y -= 18;
  page.drawRectangle({ x:margin, y:y-57, width:width-2*margin, height:66, color:green });
  y -= 9;
  const headline = assessment(report);
  text(headline.label + '  ' + headline.value,17,true,ink,margin+12);
  text(report.overall.assessed + ' of ' + report.overall.applicable + ' other checks completed',10,false,muted,margin+12);
  y -= 32;
  text('Shopping checklist',14,true);
  for (const item of report.shopping) {
    ensure(50);
    text(item.title + '  /  ' + item.result,10,true);
    text(item.detail,9,false,muted);
  }
  ensure(85);
  text('Pages checked',14,true);
  for (const sample of report.samples) {
    text(sample.kind + '  /  ' + sampleLabels[sample.status] + (sample.path ? '  /  ' + sample.path : ''),9,false,muted);
  }
  y -= 11;
  text('Other store checks',14,true);
  for (const category of report.categories) {
    ensure(18);
    text(categories[category.category] + '  /  ' + categoryResult(category),10);
  }
  y -= 13;
  ensure(66);
  text('Recommended next steps',14,true);
  if (!report.recommendations.length) text('We did not find a change we could confidently recommend from these pages.');
  for (const item of report.recommendations.slice(0,3)) {
    const paragraphs = [
      'What we found: ' + item.evidence + ' (' + item.path + ')',
      'Why it matters: ' + item.why,
      'Suggested change: ' + item.change,
      item.priority + ' priority / ' + item.effort + ' effort / ' + item.confidence + ' confidence',
    ];
    const needed = paragraphs.reduce((sum,value) => sum + 15 * wrap(value,regular,10,width-2*margin).length,sumTitle(item.title));
    ensure(needed + 15);
    text(item.title,12,true);
    paragraphs.forEach((value,i) => text(value,10,false,i === paragraphs.length-1 ? muted : ink));
    y -= 10;
  }
  ensure(75);
  page.drawLine({ start:{x:margin,y}, end:{x:width-margin,y}, thickness:.5,color:line });
  y -= 15;
  text('A hands-on review can show how it feels to shop on a phone and go through checkout.',9,false,muted);
  text('www.cascondigital.com/tools/cro-audit/methodology',9,false,muted);
  return doc.save();

  function sumTitle(title: string) { return 17 * wrap(title,emphasis,12,width-2*margin).length; }
}
