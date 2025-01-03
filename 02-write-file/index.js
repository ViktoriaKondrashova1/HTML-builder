const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'text.txt');
const stream = new fs.createWriteStream(dir);

process.stdout.write('Hi! Write somethimg?\n');

process.stdin.on('data', (data) => {
  data.toString().trim() === 'exit' ? process.exit() : stream.write(data);
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => process.stdout.write('Goodbye!'));
