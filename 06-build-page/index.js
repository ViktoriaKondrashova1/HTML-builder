const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const projectDir = path.join(__dirname, 'project-dist');
const htmlDir = path.join(projectDir, 'index.html');
const compDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const stylesCopy = path.join(projectDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const assetsCopy = path.join(projectDir, 'assets');

//html

async function buildHtml() {
  await fsPromises.writeFile(htmlDir, '');
  let content = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf8',
  );
  const files = await fsPromises.readdir(compDir);
  for (const file of files) {
    const exp = '{{' + file.split('.')[0] + '}}';
    if (content.indexOf(exp)) {
      const addСontent = await fsPromises.readFile(
        compDir + '/' + file,
        'utf8',
      );
      content = content.replace(exp, addСontent);
    }
  }
  await fsPromises.appendFile(htmlDir, content);
}

async function createDir() {
  await fsPromises.rm(projectDir, { force: true, recursive: true });
  await fsPromises.mkdir(projectDir, (err) => {
    if (err) throw err;
  });
}

//styles

async function createStyleFile() {
  await fsPromises.rm(stylesCopy, { force: true, recursive: true });
  await fsPromises.writeFile(stylesCopy, '', (err) => {
    if (err) throw err;
  });
}

async function compileStyles() {
  await fsPromises
    .readdir(stylesDir, { withFileTypes: true })
    .then((filenames) => {
      for (const filename of filenames) {
        const extention = path.extname(filename.name);
        if (filename.isFile() && extention === '.css') {
          fs.readFile(stylesDir + '/' + filename.name, 'utf8', (err, data) => {
            if (err) throw err;
            fs.appendFile(stylesCopy, data + '\n', (err) => {
              if (err) throw err;
            });
          });
        }
      }
    });
}

//assets

async function copyAssets(src, target) {
  await fs.access(target, (err) => {
    if (err) {
      fs.mkdir(target, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });
  fs.readdir(src, { withFileTypes: true }, (err, dirnames) => {
    if (err) throw err;
    for (const dirname of dirnames) {
      const originFile = path.join(src, dirname.name);
      const copyFile = path.join(target, dirname.name);
      if (dirname.isDirectory()) {
        copyAssets(originFile, copyFile);
      } else {
        fs.copyFile(originFile, copyFile, (err) => {
          if (err) throw err;
        });
      }
    }
  });
}

async function createAssetsFolder() {
  await fsPromises.rm(assetsCopy, { force: true, recursive: true });
  await fsPromises.mkdir(assetsCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await copyAssets(assetsDir, assetsCopy);
}

//run build

async function buildProject() {
  await createDir();
  await buildHtml();
  await createStyleFile();
  await compileStyles();
  await createAssetsFolder();
}

buildProject();
