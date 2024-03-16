const fs = require('fs');
const meta = require('../package.json');

fs.mkdirSync(__dirname + '/../built', { recursive: true });
fs.writeFileSync(__dirname + '/../built/meta.json', JSON.stringify({ version: meta.version }), 'utf-8');
