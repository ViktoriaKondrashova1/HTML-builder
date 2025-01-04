const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const stylesDir = path.join(__dirname, 'styles');
const bundleDir = path.join(__dirname, 'project-dist', 'bundle.css');

fs.access(bundleDir, (err) => {
  if (err) {
    fs.open(bundleDir, 'a+', (err) => {
      if (err) throw err;
    });
  } else {
    fs.truncate(bundleDir, (err) => {
      if (err) throw err;
    });
  }
});

fsPromises.readdir(stylesDir, { withFileTypes: true }).then((files) => {
  for (let file of files) {
    if (file.isFile()) {
      const extention = path.extname(file.name);
      if (extention === '.css') {
        const fileDir = path.join(stylesDir, file.name);
        fs.readFile(fileDir, 'utf8', (err, data) => {
          if (err) throw err;
          fs.appendFile(bundleDir, data + '\n', (err) => {
            if (err) throw err;
          });
        });
      }
    }
  }
});
