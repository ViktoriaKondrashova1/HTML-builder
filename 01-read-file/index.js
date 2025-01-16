const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(dir, 'utf-8');
stream.on('data', (chunk) => console.log(chunk));
