const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(dir, { encoding: 'utf-8' });

stream.on('readable', () => console.log(stream.read()));
