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

      content = content.replace(/box-shadow\s*:([^;}]+)[;}]?/gi, (match, val) => {
        return match.endsWith('}') ? 'box-shadow: none; }' : 'box-shadow: none;';
      });

      content = content.replace(/text-shadow\s*:([^;}]+)[;}]?/gi, (match) => {
        return match.endsWith('}') ? 'text-shadow: none; }' : 'text-shadow: none;';
      });
      
      content = content.replace(/filter\s*:([^;}]+)[;}]?/gi, (match, val) => {
        let newVal = val.replace(/drop-shadow\([^)]*\)/gi, '').trim();
        if (!newVal) newVal = 'none';
        return match.endsWith('}') ? `filter: ${newVal}; }` : `filter: ${newVal};`;
      });
      
      content = content.replace(/-webkit-filter\s*:([^;}]+)[;}]?/gi, (match, val) => {
        let newVal = val.replace(/drop-shadow\([^)]*\)/gi, '').trim();
        if (!newVal) newVal = 'none';
        return match.endsWith('}') ? `-webkit-filter: ${newVal}; }` : `-webkit-filter: ${newVal};`;
      });
      
      content = content.replace(/--(shadow|glow)[^:]*\s*:([^;}]+)[;}]?/gi, (match) => {
        let varName = match.split(':')[0];
        return match.endsWith('}') ? `${varName}: none; }` : `${varName}: none;`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Processed:', fullPath);
      }
    }
  }
}

processDir(process.argv[2] || 'src');
