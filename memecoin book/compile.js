const fs = require("fs");
const path = require("path");
const docx = require("docx");
const B = require("./build");

console.log("Starting compilation of the Memecoin Book...");

// 1. Require chapters in order to populate B.children
try {
  require("./ch1-4");
  console.log("Chapters 1-4 loaded.");
  require("./ch5-8");
  console.log("Chapters 5-8 loaded.");
  require("./ch9-12");
  console.log("Chapters 9-12 loaded.");
} catch (err) {
  console.error("Error loading chapter files:", err);
  process.exit(1);
}

// 2. Create the Document
const doc = new docx.Document({
  sections: [
    {
      properties: {},
      children: B.children
    }
  ]
});

// 3. Package and save
docx.Packer.toBuffer(doc)
  .then((buffer) => {
    const filename = "THE_TRENCHES_by_Tanvir_Khan.docx";
    
    // Output paths
    const pathsToSave = [
      path.join(__dirname, filename), // C:\...\Absconded\memecoin book\THE_TRENCHES_by_Tanvir_Khan.docx
      path.join(__dirname, "..", "public", filename), // C:\...\Absconded\public\THE_TRENCHES_by_Tanvir_Khan.docx
    ];
    
    // If Next.js export out folder exists, save there too
    const outDir = path.join(__dirname, "..", "out");
    if (fs.existsSync(outDir)) {
      pathsToSave.push(path.join(outDir, filename));
    }
    
    pathsToSave.forEach((destPath) => {
      try {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, buffer);
        console.log(`Document successfully compiled and saved to: ${destPath}`);
      } catch (e) {
        console.error(`Failed to save to ${destPath}:`, e.message);
      }
    });
    
    console.log("Compilation complete!");
  })
  .catch((err) => {
    console.error("Error generating document buffer:", err);
    process.exit(1);
  });
