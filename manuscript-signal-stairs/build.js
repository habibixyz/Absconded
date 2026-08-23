const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, PageNumber, Header, Footer, BorderStyle, TabStopType, TabStopPosition,
  Table, TableRow, TableCell, WidthType, ShadingType, LevelFormat, convertInchesToTwip
} = require("docx");

const p1 = require("./content_part1.js");
const p2 = require("./content_part2.js");
const p3 = require("./content_part3.js");

const allChapters = [...p1.chapters, ...p2.chapters, ...p3.chapters];

const NAVY = "1F2937";
const GOLD = "9C6B2C";
const GRAY = "555555";

function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 200, line: 300 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 24, color: "222222" })],
    ...opts,
  });
}

function headingPara(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 27, color: NAVY })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const children = [];

// ---------- TITLE PAGE ----------
children.push(
  new Paragraph({ spacing: { before: 2600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "", size: 2 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: p1.front.title, bold: true, size: 60, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 900 },
    children: [new TextRun({ text: p1.front.subtitle, italics: true, size: 28, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1400 },
    children: [new TextRun({ text: p1.front.author, size: 26, color: "111111" })] }),
  pageBreak(),
);

// ---------- EPIGRAPH PAGE ----------
children.push(
  new Paragraph({ spacing: { before: 3200 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "\u201C" + p1.front.epigraph + "\u201D", italics: true, size: 30, color: NAVY })] }),
  pageBreak(),
);

// ---------- TABLE OF CONTENTS (manual, styled) ----------
children.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 500 },
    children: [new TextRun({ text: "Contents", bold: true, size: 40, color: NAVY })] }),
  new Paragraph({ spacing: { after: 300 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: "dot" }],
    children: [new TextRun({ text: "Introduction\t" + "", size: 24 })] }),
);
allChapters.forEach(ch => {
  children.push(new Paragraph({ spacing: { after: 220 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: "dot" }],
    children: [new TextRun({ text: `Chapter ${ch.number} \u2014 ${ch.title}\t`, size: 24 })] }));
});
children.push(new Paragraph({ spacing: { after: 220 },
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: "dot" }],
  children: [new TextRun({ text: "Epilogue \u2014 Still Building\t", size: 24 })] }));
children.push(pageBreak());

// ---------- INTRO ----------
function renderSectioned(block, isIntro) {
  children.push(
    new Paragraph({ spacing: { before: 1600, after: 100 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: isIntro ? "" : `CHAPTER ${block.number}`, size: 22, color: GOLD, bold: true })] }),
    new Paragraph({ spacing: { after: 300 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: block.title, bold: true, size: 44, color: NAVY })] }),
    new Paragraph({ spacing: { after: 700 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "\u201C" + block.epigraph + "\u201D", italics: true, size: 24, color: GRAY })] }),
  );
  block.sections.forEach(sec => {
    children.push(headingPara(sec.heading));
    sec.paragraphs.forEach(t => children.push(bodyPara(t)));
  });
  children.push(pageBreak());
}

renderSectioned(p1.intro, true);
allChapters.forEach(ch => renderSectioned(ch, false));

// ---------- EPILOGUE ----------
children.push(
  new Paragraph({ spacing: { before: 1600, after: 100 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: p3.epilogue.title.toUpperCase(), size: 22, color: GOLD, bold: true })] }),
  new Paragraph({ spacing: { after: 700 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: p3.epilogue.subtitle, bold: true, size: 44, color: NAVY })] }),
);
p3.epilogue.paragraphs.forEach(t => children.push(bodyPara(t)));

// final closing mark
children.push(
  new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "\u2014", size: 28, color: GOLD })] }),
);

// ---------- DOCUMENT ----------
const doc = new Document({
  creator: "Tanvir Khan",
  title: p1.front.title,
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } },
            children: [new TextRun({ text: p1.front.title.toUpperCase(), size: 16, color: "999999" })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
            ],
          })],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  const path = require("path");
  fs.writeFileSync(path.join(__dirname, "output.docx"), buf);
  console.log("done, bytes:", buf.length);
});
