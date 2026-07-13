const fs = require('fs');

const replacements = [
  { regex: /bg-\[\#030303\]/g, replacement: 'bg-slate-900' },
  { regex: /rgba\(3, 3, 3,/g, replacement: 'rgba(15, 23, 42,' }, // slate-900
];

['src/App.tsx', 'src/components/PortfolioView.tsx', 'src/components/Header.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(r => content = content.replace(r.regex, r.replacement));
    fs.writeFileSync(file, content, 'utf8');
  }
});

const cssFile = 'src/index.css';
if (fs.existsSync(cssFile)) {
  let content = fs.readFileSync(cssFile, 'utf8');
  content = content.replace(/#030303/g, '#0f172a'); // slate-900
  content = content.replace(/rgba\(3, 3, 3,/g, 'rgba(15, 23, 42,');
  // terminal loader
  content = content.replace(/background-color: #0c0c0e;/g, 'background-color: #1e293b;'); // slate-800
  // glass panels
  content = content.replace(/rgba\(10, 10, 14, 0\.85\)/g, 'rgba(15, 23, 42, 0.85)');
  fs.writeFileSync(cssFile, content, 'utf8');
}
console.log('Colors adjusted');
