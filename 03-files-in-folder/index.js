const readdir = require('node:fs/promises');
const path = require('node:path');
readdir
  .readdir(path.resolve(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((result) => {
    for (const file of result) {
      if (file.isFile()) {
        readdir
          .stat(path.resolve(__dirname, 'secret-folder', file.name))
          .then((stat) => {
            console.log(
              `${String(file.name).slice(
                0,
                String(file.name).lastIndexOf('.'),
              )} - ${String(path.extname(file.name)).slice(1)} - ${stat.size}b`,
            );
          });
      }
    }
  });
