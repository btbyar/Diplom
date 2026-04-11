const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/pages/PartsPage.css',
  'src/pages/BookingPage.css',
  'src/pages/ServicesPage.css'
];

filesToProcess.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Borders
    content = content.replace(/border(-bottom|-top|-left|-right)?:\s*1px solid rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.\d+\s*\);/g, 'border$1: 1px solid var(--border-color);');
    
    // Backgrounds
    content = content.replace(/background(-color)?:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[1-5]\s*\);/g, 'background$1: var(--surface-hover);');
    content = content.replace(/background(-color)?:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.[6-9]\s*\);/g, 'background$1: var(--surface-color);');
    
    // Text colors
    content = content.replace(/color:\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.\d+\s*\);/g, 'color: var(--text-muted);');

    // Remove specific radial gradients from PartsPage
    content = content.replace(/background:\s*radial-gradient\(circle at top, rgba\(255, 255, 255, 0\.05\), transparent 50%\);/g, 'display: none;');

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
