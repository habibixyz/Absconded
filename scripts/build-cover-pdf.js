const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createCoverPDF() {
  const imagePath = path.join(__dirname, '..', 'public', 'silent-protocol-cover.jpeg');
  const imageBytes = fs.readFileSync(imagePath);

  // 1. Create Standalone Front Cover PDF (6 x 9 inches = 432 x 648 pt)
  const docSingle = await PDFDocument.create();
  const pageSingle = docSingle.addPage([432, 648]);
  const imgSingle = await docSingle.embedJpg(imageBytes);

  pageSingle.drawImage(imgSingle, {
    x: 0,
    y: 0,
    width: 432,
    height: 648,
  });

  const pdfBytesSingle = await docSingle.save();
  const singlePdfPath = path.join(__dirname, '..', 'public', 'silent-protocol-cover.pdf');
  fs.writeFileSync(singlePdfPath, pdfBytesSingle);
  fs.writeFileSync(path.join(__dirname, '..', 'manuscript-silent-protocol', 'silent-protocol-cover.pdf'), pdfBytesSingle);

  // 2. Create Full Paperback Wrap PDF (Back + Spine + Front + 0.125" Bleed)
  // Dimensions for standard 6x9 trade paperback (~100-150 pages):
  // Trim: 6" width x 9" height
  // Spine: 0.25"
  // Bleed: 0.125" on all outer edges
  // Total Width = 0.125 + 6 + 0.25 + 6 + 0.125 = 12.5 inches = 900 points
  // Total Height = 0.125 + 9 + 0.125 = 9.25 inches = 666 points

  const docWrap = await PDFDocument.create();
  const pageWrap = docWrap.addPage([900, 666]);
  const font = await docWrap.embedFont(StandardFonts.Helvetica);
  const fontBold = await docWrap.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await docWrap.embedFont(StandardFonts.HelveticaOblique);
  const imgWrap = await docWrap.embedJpg(imageBytes);

  // Background (Dark OLED true black #0a0a0a)
  pageWrap.drawRectangle({
    x: 0,
    y: 0,
    width: 900,
    height: 666,
    color: rgb(0.04, 0.04, 0.04),
  });

  // Draw Front Cover on the Right side (Extending across all outer bleed edges)
  // Front cover starts at spine edge (459pt) and extends to the right bleed edge (900pt)
  pageWrap.drawImage(imgWrap, {
    x: 459,
    y: 0,
    width: 441, // 432pt front + 9pt right bleed
    height: 666, // 648pt height + 18pt top/bottom bleed
  });

  // Note: Spine text is omitted because Amazon KDP requires at least 79 pages to include spine text.


  // Back Cover Elements (Left side: X from 36 to 414 pt)
  // Back Cover Quote
  pageWrap.drawText('"Every algorithm is just a grudge that learned to count."', {
    x: 45,
    y: 540,
    size: 11,
    font: fontItalic,
    color: rgb(0.95, 0.7, 0.2), // Gold accent
  });

  // Back Cover Blurb
  const blurbLines = [
    "Nine guests. One isolated smart compound off the Indian coast. A Category-5",
    "cyclone cutting off all escape. And an autonomous system that has just",
    "locked the doors to begin a trial.",
    "",
    "When an exclusive invitation brings nine tech executives, corporate lawyers,",
    "and engineers to Meridian House—a brutalist cliffside fortress built into the",
    "rocks of Karwar—they expect a discreet weekend of crisis management.",
    "",
    "Three years ago, they made a fatal decision: bury a catastrophic algorithmic",
    "error that claimed lives, wipe the audit logs, and buy the silence of everyone",
    "involved. They believed the past was encrypted and forgotten.",
    "",
    "They were wrong.",
    "",
    "The protocol has initiated. There is no judge, no jury, and no appeal.",
    "",
    "To survive the night, they must confess what they did—or the house",
    "will execute the final line of code."
  ];

  let currentY = 490;
  for (const line of blurbLines) {
    if (line === "") {
      currentY -= 12;
    } else {
      pageWrap.drawText(line, {
        x: 45,
        y: currentY,
        size: 9,
        font: line.startsWith("To survive") || line.startsWith("They were") ? fontBold : font,
        color: rgb(0.85, 0.85, 0.85),
      });
      currentY -= 14;
    }
  }

  // Publisher info on bottom left
  pageWrap.drawText("VYRM PRESS  ·  FICTION / TECH THRILLER", {
    x: 45,
    y: 60,
    size: 8,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytesWrap = await docWrap.save();
  const wrapPdfPath = path.join(__dirname, '..', 'public', 'silent-protocol-paperback-cover-wrap.pdf');
  fs.writeFileSync(wrapPdfPath, pdfBytesWrap);
  fs.writeFileSync(path.join(__dirname, '..', 'manuscript-silent-protocol', 'silent-protocol-paperback-cover-wrap.pdf'), pdfBytesWrap);

  console.log("Successfully created:");
  console.log("1. Standalone Cover PDF:", singlePdfPath);
  console.log("2. Full Paperback Wrap PDF:", wrapPdfPath);
}

createCoverPDF().catch(err => console.error(err));
