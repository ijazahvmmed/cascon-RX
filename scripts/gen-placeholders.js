const fs = require('fs');
const path = require('path');

// Minimal 1x1 PNG (transparent)  
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Minimal WebP (1x1 grey pixel)
const WEBP_1x1 = Buffer.from(
  'UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoBAAEAAUAmJYgCdAEO/hepgAAA/v5PtRqu4r//+sPj38D/5fNf0H//1P/+dP//Of/5sAA=',
  'base64'
);

const webpFiles = [
  'public/images/testimonials/vibezon_testi.webp',
  'public/images/testimonials/rewise_testi.webp',
  'public/images/testimonials/carsupply_testi.webp',
  'public/images/work/vibezon_testi.webp',
  'public/images/work/bagus_testi.webp',
  'public/images/work/hanbee_testi.webp',
  'public/images/work/reborn_testi.webp',
  'public/images/work/carsupply_testi.webp',
  'public/images/services/shopify.webp',
  'public/images/services/ai-media.webp',
  'public/images/services/performance.webp',
  'public/images/services/automation.webp',
  'public/images/services/seo.webp',
  'public/images/services/content.webp',
  'public/images/pages/about.webp',
  'public/images/pages/careers.webp',
  'public/images/pages/clients.webp',
  'public/images/pages/cascon.webp',
];

const pngFiles = [
  'public/images/badges/shopifypartners.png',
  'public/images/badges/figma.png',
  'public/images/badges/higgsfield.png',
  'public/images/badges/supermoney.png',
  'public/favicon.png',
  'public/og-image.png',
];

const ROOT = process.cwd();

for (const file of webpFiles) {
  const fp = path.join(ROOT, file);
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, WEBP_1x1);
    console.log('Created:', file);
  }
}

for (const file of pngFiles) {
  const fp = path.join(ROOT, file);
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, PNG_1x1);
    console.log('Created:', file);
  }
}

console.log('Done! All placeholder images created.');
