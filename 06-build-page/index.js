const fsPromises = require('node:fs/promises');
const path = require('node:path');
const fs = require('fs');
const newDir = path.resolve(__dirname, 'project-dist');
const assetsDir = path.resolve(__dirname, 'assets');
const cssDir = path.resolve(__dirname, 'styles');
const componentsDir = path.resolve(__dirname, 'components');

async function delDir(dir) {
  await fsPromises.readdir(dir, { withFileTypes: true })
    .then(async (result) =>  {
      for (const file of result) {
        if (file.isFile()) { await fsPromises.rm(path.resolve(dir, file.name)); }
        else { await fsPromises.rm(path.resolve(dir, file.name), { recursive: true }, () => { return delDir(path.resolve(dir, file.name)); }); }
      }
    });
}  

async function createDir(newDir) {
  return fsPromises.mkdir(path.resolve(newDir), { recursive: true });
}

async function copyAssets(assetsDir, newDir) {
  const result = await fsPromises.readdir(assetsDir, { withFileTypes: true });
  for (const file of result) {
    if (file.isFile()) {
      await fsPromises.copyFile(path.resolve(assetsDir, file.name), path.resolve(newDir, file.name));
    }
    else {
      await fsPromises.mkdir(path.resolve(newDir, file.name), { recursive: true })
        .then(async() => { await copyAssets(path.resolve(assetsDir, file.name), path.resolve(newDir, file.name)); });
    }
  }
}

async function buildCSS(cssDir, newDir) {
  const wStream = fs.createWriteStream(path.resolve(newDir, 'style.css'));
  fsPromises.readdir(cssDir, { withFileTypes: true })
    .then((result) => {
      for (const file of result) {
        if (file.isFile() && path.extname(file.name) === '.css') {
        const rStream = fs.createReadStream(path.resolve(cssDir, file.name));
        rStream.on('data', (chank) => {
          wStream.write(chank);
          });
      }
    }
    });
}

async function buildHTML(componentsDir, newDir, template) {
  let outputFile = `${await fsPromises.readFile(template)}`; 

  while (outputFile.includes('{{')) {
    let fileName = outputFile.slice(
      outputFile.indexOf('{{') + 2,
      outputFile.indexOf('}}'),
    );
    let innerHTML = `${await fsPromises.readFile(
      path.resolve(componentsDir, fileName + '.html'),
    )}`;
    outputFile = outputFile.replace(`{{${fileName}}}`, innerHTML);
  }

  await fsPromises.writeFile(path.resolve(newDir, 'index.html') , outputFile);
}

async function buildPage() {
  await createDir(newDir); 
  await delDir(newDir);
  await copyAssets(assetsDir, path.resolve(newDir, 'assets'));
  await buildCSS(cssDir, newDir);
  await buildHTML(componentsDir, newDir, path.resolve(__dirname, 'template.html'));
}

buildPage();

