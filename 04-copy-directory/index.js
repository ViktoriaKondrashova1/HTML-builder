const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { mkdir, copyFile } = require('node:fs/promises');

const copyDir = async () => {
  const dirCopy = path.join(__dirname, 'files-copy');
  const dir = path.join(__dirname, 'files');

  fs.access(dirCopy, (err) => {
    if (!err) {
      fs.readdir(dirCopy, (err, files) => {
        if (err) throw err;
        for (let file of files) {
          fs.unlink(dirCopy + '/' + file, (err) => {
            if (err) throw err;
          });
        }
      });
    }

    mkdir(dirCopy, { recursive: true });

    fsPromises.readdir(dir, { withFileTypes: true }).then((files) => {
      for (let file of files) {
        const fileDir = path.join(dir, file.name);
        const destination = path.join(dirCopy, file.name);
        copyFile(fileDir, destination);
      }
    });
  });
};

copyDir();
