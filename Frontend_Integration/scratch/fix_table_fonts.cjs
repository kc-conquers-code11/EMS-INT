const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

const TH_REGEX = /<th\s+[^>]*className=["']([^"']+)["'][^>]*>/g;
const TD_REGEX = /<td\s+[^>]*className=["']([^"']+)["'][^>]*>/g;

let filesModified = 0;

walkDir(DIR, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Process <th>
  content = content.replace(TH_REGEX, (match, className) => {
    let classes = className.split(' ').filter(c => c.trim() !== '');
    
    // Remove old paddings and fonts
    classes = classes.filter(c => !c.match(/^px-|^py-|^p-/));
    classes = classes.filter(c => !c.match(/^text-\[\d+px\]/));
    classes = classes.filter(c => !c.match(/^font-(medium|semibold|bold|normal)/));
    classes = classes.filter(c => c !== 'uppercase' && c !== 'tracking-wider');
    
    // Add new standard classes
    classes.unshift('px-8', 'py-5', 'text-[12px]', 'font-bold', 'uppercase', 'tracking-wider');
    
    // Ensure standard text color if it's currently using another common gray
    if (classes.includes('text-[#475467]')) {
      classes = classes.filter(c => c !== 'text-[#475467]');
      classes.push('text-[#667085]');
    } else if (!classes.some(c => c.startsWith('text-['))) {
        classes.push('text-[#667085]');
    }

    // Keep custom widths and text alignments, e.g., w-[...], text-center
    return match.replace(className, classes.join(' '));
  });

  // Process <td>
  content = content.replace(TD_REGEX, (match, className) => {
    let classes = className.split(' ').filter(c => c.trim() !== '');
    
    // Remove old paddings and fonts
    classes = classes.filter(c => !c.match(/^px-|^py-|^p-/));
    classes = classes.filter(c => !c.match(/^text-\[\d+px\]/));
    classes = classes.filter(c => !c.match(/^font-(medium|semibold|bold|normal)/));
    
    // Add new standard classes
    classes.unshift('px-8', 'py-6', 'text-[15px]', 'font-medium');

    return match.replace(className, classes.join(' '));
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
    filesModified++;
  }
});

console.log('Total files modified:', filesModified);
