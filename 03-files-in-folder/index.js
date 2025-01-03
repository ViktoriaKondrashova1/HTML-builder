const path = require('path');
const fsPromises = require('fs').promises;

const dir = path.join(__dirname, 'secret-folder');

fsPromises.readdir(dir, { withFileTypes: true }).then((files) => {
  for (let file of files) {
    if (file.isFile()) {
      const extention = path.extname(file.name);
      const name = path.basename(file.name, extention);

      async function getStats() {
        const fileDir = path.join(dir, file.name);
        const stat = await fsPromises.stat(fileDir);
        return stat.size / 1024 + 'kb';
      }

      getStats().then((size) => {
        const fileInfo = `${name} - ${extention.slice(1)} - ${size}`;
        console.log(fileInfo);
      });
    }
  }
});
