const fs = require('fs');
const path = require('path');

const ROOT = 'd:\\GROWPHIL PROJECT\\MEDINGEN WRAP\\next-ssr';

const relativePatterns = [
  /href=["'](?!https?:|mailto:|tel:|\/|#)([^"']+)["']/g,
  /to=["'](?!https?:|mailto:|tel:|\/|#)([^"']+)["']/g,
  /src=["'](?!https?:|mailto:|tel:|\/|#)([^"']+)["']/g
];

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(fullPath);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        checkFile(fullPath);
      }
    }
  });
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      relativePatterns.forEach(pattern => {
        let match;
        // reset regex state
        pattern.lastIndex = 0;
        while ((match = pattern.exec(line)) !== null) {
          console.log(`${filePath}:${idx + 1} -> Found: ${match[0]}`);
        }
      });
    });
  } catch (err) {
    // ignore
  }
}

walk(ROOT);
console.log("Done checking.");
