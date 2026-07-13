const fs = require('fs');

const replacements = [
  { regex: /bg-slate-900/g, replacement: 'bg-slate-800' },
  { regex: /bg-\[\#0f172a\]/g, replacement: 'bg-slate-800' },
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
  content = content.replace(/#0f172a/g, '#1e293b'); // slate-800
  content = content.replace(/rgba\(15, 23, 42,/g, 'rgba(30, 41, 59,'); // slate-800 rgb
  // terminal loader
  content = content.replace(/background-color: #1e293b;/g, 'background-color: #334155;'); // slate-700
  content = content.replace(/bg-slate-900/g, 'bg-slate-800');
  fs.writeFileSync(cssFile, content, 'utf8');
}
console.log('Colors adjusted to slate-800');
