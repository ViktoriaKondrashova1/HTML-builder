const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const projectDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const stylesCopy = path.join(projectDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const assetsCopy = path.join(projectDir, 'assets');

async function createStyleFile() {
  await fsPromises.rm(stylesCopy, { force: true, recursive: true });
  await fsPromises.writeFile(stylesCopy, '', (err) => {
    if (err) throw err;
  });
}

async function compileStyles() {
  await fsPromises.readdir(stylesDir, { withFileTypes: true }).then((files) => {
    for (let file of files) {
      if (file.isFile()) {
        const extention = path.extname(file.name);
        if (extention === '.css') {
          const fileDir = path.join(stylesDir, file.name);
          fs.readFile(fileDir, 'utf8', (err, data) => {
            if (err) throw err;
            fs.appendFile(projectDir, data + '\n', (err) => {
              if (err) throw err;
            });
          });
        }
      }
    }
  });
}

async function copyAssets(src, target) {
  fs.access(target, (err) => {
    if (!err) {
      fs.mkdir(target, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }

    fs.readdir(src, { withFileTypes: true }, (err, dirNames) => {
      if (err) throw err;
      for (let dirName of dirNames) {
        const originDir = path.join(src, dirName.name);
        const copyDir = path.join(target, dirName.name);
        if (dirName.isDirectory()) {
          copyAssets(originDir, copyDir);
        } else {
          fs.copyFile(originDir, copyDir, (err) => {
            if (err) throw err;
          });
        }
      }
    });
  });
}

async function createAssetsFolder() {
  await fsPromises.rm(assetsCopy, { force: true, recursive: true });
  await fsPromises.mkdir(assetsCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await copyAssets(assetsDir, assetsCopy);
}

async function buildProject() {
  await createStyleFile();
  await compileStyles();
  await createAssetsFolder();
}

buildProject();
