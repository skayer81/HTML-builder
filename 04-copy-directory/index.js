const readdir = require('node:fs/promises');
const path = require('node:path');
const newDir = path.resolve(__dirname, 'files-copy')

function copyDir(){

readdir.mkdir(newDir, { recursive: true })
   .then((result) => {
      if (!result) {
        readdir.readdir(newDir, { withFileTypes: true }) 
          .then((result) => {
            for (const file of result) {
              readdir.unlink(path.resolve(newDir, file.name))
            }   
          })
      }
    readdir.readdir(path.resolve(__dirname, 'files'), { withFileTypes: true })
      .then((result) => {
        for (const file of result) {
          if (file.isFile()) {
              readdir.copyFile(path.resolve(__dirname, 'files', file.name), path.resolve(newDir, file.name ))
          }
        }
      })
  })
}

copyDir()