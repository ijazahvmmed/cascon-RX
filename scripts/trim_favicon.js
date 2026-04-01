const { Jimp } = require('jimp');
const path = require('path');

async function trimFavicon() {
  const filePath = path.join(__dirname, '../public/favicon.png');
  try {
    const image = await Jimp.read(filePath);
    // autocrop transparent pixels
    image.autocrop();
    // write back to same file
    await image.write(filePath);
    console.log('Successfully trimmed favicon padding!');
  } catch (error) {
    console.error('Error trimming favicon:', error);
  }
}

trimFavicon();