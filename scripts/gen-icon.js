#!/usr/bin/env node

/**
 * Script to generate a new icon file for Lucide icons with NativeWind cssInterop.
 * Usage: pnpm gen:icon IconName
 */
const fs = require('fs');
const path = require('path');

const [,, iconName] = process.argv;

if (!iconName) {
  console.error('Usage: pnpm gen:icon <IconName>');
  process.exit(1);
}

const iconFileName = `${iconName}.tsx`;
const iconFilePath = path.join(__dirname, '../lib/icons', iconFileName);
const indexFilePath = path.join(__dirname, '../lib/icons', 'index.ts');

const template = `import { ${iconName} as Lucide${iconName} } from 'lucide-react-native';
import { iconWithClassName } from './iconWithClassName';

iconWithClassName(Lucide${iconName});

export const ${iconName}Icon = Lucide${iconName};
`;

if (fs.existsSync(iconFilePath)) {
  console.error(`Icon file already exists: ${iconFilePath}`);
  process.exit(1);
}

fs.writeFileSync(iconFilePath, template, 'utf8');

// Add export to index.ts
function addExportToIndex(iconName) {
  const exportLine = `export { ${iconName}Icon } from './${iconName}';\n`;
  let content = '';
  if (fs.existsSync(indexFilePath)) {
    content = fs.readFileSync(indexFilePath, 'utf8');
    // Only add if not already present
    if (!content.includes(exportLine)) {
      content += exportLine;
      fs.writeFileSync(indexFilePath, content, 'utf8');
    }
  } else {
    fs.writeFileSync(indexFilePath, exportLine, 'utf8');
  }
}

addExportToIndex(iconName);
console.log(`Generated icon: ${iconFilePath}`);
