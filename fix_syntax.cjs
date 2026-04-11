const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Fix filter syntax errors
      content = content.replace(/filter:\s*\);/g, 'filter: none;');
      content = content.replace(/filter:\s*\)\s+brightness\(([^)]*)\);/g, 'filter: brightness($1);');
      content = content.replace(/filter:\s*\)/g, 'filter: none');
      
      // Fix .logo-text-highlight syntax errors
      content = content.replace(/\.logo-text-highlight\s*\{\s*color:\s*var\(--accent-color\);\s*\}\s*text-shadow:\s*none;\s*\}/g, '.logo-text-highlight {\n  color: var(--accent-color);\n  text-shadow: none;\n}');
      content = content.replace(/\.logo-text-highlight\s*\{\s*color:\s*var\(--accent-color\);\s*\}\s*\}/g, '.logo-text-highlight {\n  color: var(--accent-color);\n}');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
