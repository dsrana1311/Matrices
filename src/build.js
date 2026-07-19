// Builds the single deployable page: inlines the variable fonts as data URIs
// and wraps the content in a standalone HTML document.
// Usage: node src/build.js [artifact-body-output-path]
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const ROOT = path.dirname(SRC);
const b64 = f => fs.readFileSync(path.join(SRC, 'fonts', f)).toString('base64');

let body = fs.readFileSync(path.join(SRC, 'lesson-content.html'), 'utf8');
body = body
  .replace('%%MANROPE_LATIN%%', () => b64('manrope-latin.woff2'))
  .replace('%%MANROPE_EXT%%', () => b64('manrope-latin-ext.woff2'))
  .replace('%%GROTESK_LATIN%%', () => b64('space-grotesk-latin.woff2'))
  .replace('%%GROTESK_EXT%%', () => b64('space-grotesk-latin-ext.woff2'));

if (body.includes('%%')) {
  console.error('Unreplaced placeholder remains');
  process.exit(1);
}

const page = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<title>Matrices Are Machines That Move Space</title>\n</head>\n<body>\n' +
  body + '\n</body>\n</html>\n';

fs.writeFileSync(path.join(ROOT, 'index.html'), page);
console.log('index.html written,', (page.length / 1024).toFixed(0) + ' KB');

const artifactOut = process.argv[2];
if (artifactOut) {
  fs.writeFileSync(artifactOut, '<title>Matrices Are Machines That Move Space</title>\n' + body);
  console.log('artifact body written to', artifactOut);
}
