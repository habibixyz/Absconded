const docx = require("docx");
const { Paragraph, TextRun, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, HeadingLevel } = docx;

// shared array where elements are accumulated
const children = [];

function H1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 32, font: "Lora" })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    keepWithNext: true
  });
}

function H2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, font: "Lora" })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    keepWithNext: true
  });
}

function P(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Inter" })],
    spacing: { after: 150 },
    lineSpacing: { before: 0, line: 312, lineRule: "auto" } // 1.3 line spacing
  });
}

function Lead(text) {
  return new Paragraph({
    children: [new TextRun({ text, italic: true, size: 24, font: "Lora", color: "444444" })],
    spacing: { before: 100, after: 250 },
    lineSpacing: { line: 330, lineRule: "auto" }
  });
}

function BL(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Inter" })],
    bullet: { level: 0 },
    spacing: { after: 100 }
  });
}

function NL(text) {
  // Prepend list item or use basic numbering. 
  // Since docx numbering requires setup, a robust fallback is standard list styling.
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Inter" })],
    bullet: { level: 0 }, // For simplicity, format list items neatly
    spacing: { after: 100 }
  });
}

function QUOTE(text, author) {
  return [
    new Paragraph({
      children: [new TextRun({ text: `“${text}”`, italic: true, size: 22, font: "Lora", color: "222222" })],
      indent: { left: 720, right: 720 },
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [new TextRun({ text: author, size: 18, font: "Inter", color: "666666" })],
      indent: { left: 720, right: 720 },
      spacing: { after: 200 }
    })
  ];
}

function PageBreakPara() {
  return new Paragraph({
    children: [new PageBreak()]
  });
}

function CalloutBox(title, lines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: "000000" } // Left border strip
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: "F8F9FA" },
            margins: { top: 150, bottom: 150, left: 200, right: 200 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: title, bold: true, size: 22, font: "Inter" })],
                spacing: { after: 100 }
              }),
              ...lines.map(line => new Paragraph({
                children: [new TextRun({ text: line, size: 20, font: "Inter" })],
                spacing: { after: 60 }
              }))
            ]
          })
        ]
      })
    ]
  });
}

function SpacerAfterTable() {
  return new Paragraph({
    spacing: { before: 150 }
  });
}

module.exports = {
  children,
  H1,
  H2,
  P,
  Lead,
  BL,
  NL,
  QUOTE,
  PageBreakPara,
  CalloutBox,
  SpacerAfterTable,
  ...docx // Export everything from docx for constructors/enums
};
