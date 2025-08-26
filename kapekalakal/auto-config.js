/**
 * auto-config-all.js
 *
 * Usage: node auto-config-all.js
 * Run from your project root.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --------------------- CONFIG ---------------------
// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to the frontend src folder
const FRONTEND_SRC = path.join(__dirname, "src");
const SERVER_FILE = path.join(__dirname, "src", "backend", "ServerH.js");
const OLD_API_URL = "http://localhost:5174";
const NEW_API_ENV = "import.meta.env.VITE_API_URL";
const REACT_FILE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
// --------------------------------------------------

// Recursively replace old API URL with env variable in frontend files
function replaceFrontendUrls(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      replaceFrontendUrls(fullPath);
    } else if (REACT_FILE_EXTENSIONS.some((ext) => fullPath.endsWith(ext))) {
      let content = fs.readFileSync(fullPath, "utf-8");

      if (content.includes(OLD_API_URL)) {
        content = content.replaceAll(`"${OLD_API_URL}"`, NEW_API_ENV);
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`✅ Updated API URL in ${fullPath}`);
      }
    }
  });
}

// Update server.js to use process.env.PORT and serve React build
function updateServerFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Server file not found at ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf-8");

  // Replace hardcoded port
  content = content.replace(
    /app\.listen\(\d+/,
    "const PORT = process.env.PORT || 5174;\napp.listen(PORT"
  );

  // Add Express static serving snippet if not already present
  if (!content.includes("express.static")) {
    const staticSnippet = `
import path from "path";

// Serve React build
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
`;

    // Insert snippet before app.listen
    content = content.replace(
      /app\.listen\(PORT[\s\S]*\);/,
      `${staticSnippet}\n$&`
    );
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Updated ${filePath} for dynamic port and static frontend`);
}

// Run all changes
function run() {
  console.log(
    "🔧 Replacing frontend hardcoded URLs in all relevant file types..."
  );
  replaceFrontendUrls(FRONTEND_SRC);

  console.log("🔧 Updating server.js...");
  updateServerFile(SERVER_FILE);

  console.log(
    "🎉 All done! Now set VITE_API_URL in your .env and your project is ready to deploy!"
  );
}

run();
