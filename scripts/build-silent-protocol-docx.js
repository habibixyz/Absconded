const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  PageNumber,
  Header,
  Footer,
  BorderStyle,
  TabStopType,
  TabStopPosition,
  InternalHyperlink
} = require('docx');

// Read data.js and extract the silent-protocol manuscript
const dataFilePath = path.join(__dirname, '..', 'app', 'data.js');
const dataContent = fs.readFileSync(dataFilePath, 'utf8');

// Parse books object from data.js
const booksExportMatch = dataContent.match(/export const books\s*=\s*(\[[\s\S]*?\n\]);/);
if (!booksExportMatch) {
  console.error("Could not find books array in app/data.js");
  process.exit(1);
}

const books = eval(booksExportMatch[1]);
const book = books.find(b => b.id === 'silent-protocol');

if (!book) {
  console.error("Silent Protocol manuscript not found in app/data.js");
  process.exit(1);
}

const NAVY = "111827";
const GOLD = "B45309";
const DARK_GRAY = "374151";

const children = [];

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// 1. TITLE PAGE
children.push(
  new Paragraph({ spacing: { before: 2400 }, alignment: AlignmentType.CENTER, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "SILENT PROTOCOL", bold: true, size: 54, color: NAVY, font: "Georgia" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 800 },
    children: [new TextRun({ text: "A Meridian House Thriller", italics: true, size: 28, color: GOLD, font: "Georgia" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 200 },
    children: [new TextRun({ text: "Tanvir Khan", size: 28, bold: true, color: NAVY, font: "Georgia" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "VYRM Press", size: 22, color: DARK_GRAY, font: "Georgia" })]
  }),
  pageBreak()
);

// 2. EPIGRAPH PAGE
if (book.coverQuote) {
  children.push(
    new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: book.coverQuote, italics: true, size: 26, color: NAVY, font: "Georgia" })]
    }),
    pageBreak()
  );
}

// 3. TABLE OF CONTENTS
children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 600, after: 600 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Table of Contents", bold: true, size: 36, color: NAVY, font: "Georgia" })]
  })
);

book.sections.forEach(section => {
  const displayTitle = section.number === 0 
    ? (section.label ? `${section.label}: ${section.title}` : section.title)
    : `Chapter ${section.number}: ${section.title}`;

  children.push(
    new Paragraph({
      spacing: { after: 240, line: 360 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: "dot" }],
      children: [
        new InternalHyperlink({
          anchor: `sec_${section.id}`,
          children: [
            new TextRun({
              text: displayTitle,
              size: 24,
              color: NAVY,
              font: "Georgia"
            })
          ]
        })
      ]
    })
  );
});

children.push(pageBreak());

// 4. CHAPTERS
book.sections.forEach(section => {
  const chapterLabel = section.number === 0 
    ? (section.label || "PROLOGUE").toUpperCase()
    : `CHAPTER ${section.number}`;

  // Chapter Header
  children.push(
    new Paragraph({
      spacing: { before: 1200, after: 150 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: chapterLabel, bold: true, size: 22, color: GOLD, font: "Georgia" })]
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: section.title,
          bold: true,
          size: 40,
          color: NAVY,
          font: "Georgia",
          id: `sec_${section.id}`
        })
      ]
    })
  );

  if (section.epigraph) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: `“${section.epigraph}”`, italics: true, size: 22, color: DARK_GRAY, font: "Georgia" })]
      })
    );
  }

  // Chapter Body Content
  if (section.content && section.content.length > 0) {
    section.content.forEach((block, idx) => {
      if (block.type === 'pull') {
        children.push(
          new Paragraph({
            spacing: { before: 300, after: 300, line: 360 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: block.text,
                bold: true,
                italics: true,
                size: 24,
                color: GOLD,
                font: "Georgia"
              })
            ]
          })
        );
      } else if (block.type === 'terminal') {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 200, line: 300 },
            children: [
              new TextRun({
                text: block.text,
                font: "Courier New",
                size: 20,
                color: "059669"
              })
            ]
          })
        );
      } else {
        // Standard body paragraph
        children.push(
          new Paragraph({
            spacing: { after: 200, line: 360 },
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: idx === 0 ? 0 : 360 }, // First line indent except first paragraph
            children: [
              new TextRun({
                text: block.text,
                size: 24,
                color: "1F2937",
                font: "Georgia"
              })
            ]
          })
        );
      }
    });
  }

  children.push(pageBreak());
});

// BUILD DOCUMENT
const doc = new Document({
  creator: "Tanvir Khan",
  title: "Silent Protocol - A Meridian House Thriller",
  description: book.description,
  sections: [
    {
      properties: {
        page: {
          size: { width: 8640, height: 12960 }, // Exact 6 x 9 inches (Trade Paperback)
          margin: { top: 1080, bottom: 1080, left: 1080, right: 720 } // Safe 0.75" inside / 0.5" outside
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB", space: 4 } },
              children: [new TextRun({ text: "SILENT PROTOCOL", size: 16, color: "9CA3AF", font: "Georgia" })]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "9CA3AF", font: "Georgia" })]
            })
          ]
        })
      },
      children
    }
  ]
});

Packer.toBuffer(doc).then(buf => {
  const outDir = path.join(__dirname, '..', 'manuscript-silent-protocol');
  const outFile = path.join(outDir, 'Silent Protocol - A Meridian House Thriller.docx');
  fs.writeFileSync(outFile, buf);

  const publicOutFile = path.join(__dirname, '..', 'public', 'SILENT_PROTOCOL_by_Tanvir_Khan.docx');
  fs.writeFileSync(publicOutFile, buf);

  console.log(`Generated Kindle-ready Word document with Table of Contents (${buf.length} bytes) at ${outFile}`);
});
