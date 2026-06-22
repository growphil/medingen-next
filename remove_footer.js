const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let filesChanged = 0;

walkDir('./src/screens', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove import
    content = content.replace(/import\s+\{\s*Footer\s*\}\s+from\s+["'].*?LandingPage.*?["'];?\n?/g, '');
    content = content.replace(/import\s+\{\s*[^}]*?Footer\b[^}]*?\}\s+from\s+["'].*?LandingPage.*?["'];?\n?/g, (match) => {
        // If it imports other things too like HelpCenter
        return match.replace(/,\s*Footer\b|\bFooter\s*,?/g, '').replace(/\{\s*\}/g, '{}');
    });

    // Remove component usage
    content = content.replace(/<Footer\s*\/?>(<\/Footer>)?\s*\n?/g, '');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
      filesChanged++;
    }
  }
});

console.log('Total files changed:', filesChanged);
