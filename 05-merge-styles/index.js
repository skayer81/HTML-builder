const readdir = require('node:fs/promises');
const path = require('node:path');
const fs = require('fs');
const newDir = path.resolve(__dirname, 'project-dist');
const oldDir = path.resolve(__dirname, 'styles');

function mergeStyle() {
  readdir
    .mkdir(newDir, { recursive: true })
    .then((result) => {
      if (!result) {
        return readdir
          .readdir(newDir, { withFileTypes: true })
          .then((result) => {
            for (const file of result) {
              if (
                file.isFile() &&
                path.extname(path.resolve(newDir, file.name)) === '.css'
              ) {
                readdir.unlink(path.resolve(newDir, file.name));
              }
            }
          });
      }
    })
    .then(() => {
      const wStream = fs.createWriteStream(path.resolve(newDir, 'bundle.css'));
      readdir.readdir(oldDir, { withFileTypes: true }).then((result) => {
        for (const file of result) {
          if (
            file.isFile() &&
            path.extname(path.resolve(oldDir, file.name)) === '.css'
          ) {
            const rStream = fs.createReadStream(
              path.resolve(oldDir, file.name),
            );
            rStream.on('data', (chank) => {
              wStream.write(chank);
            });
          }
        }
      });
    });
}

mergeStyle();
