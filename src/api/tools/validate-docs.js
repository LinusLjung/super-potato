const fs = require('fs');
const path = require('path');
const swagger = require('swagger-cli');

const docsFolder = path.resolve(__dirname, '../docs');

function isDir(file) {
  return new Promise((resolve) => {
    fs.stat(file, (err, stats) => {
      resolve(stats.isDirectory());
    });
  });
}

function getFiles(dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      resolve(
        Promise.all(
          files.map((file) => {
            return new Promise((resolve) => {
              file = path.resolve(dir, file);

              resolve(
                isDir(file)
                  .then((isDir) => {
                    return isDir;
                  })
                  .then((isDir) => (isDir ? getFiles(path.resolve(dir, file)) : file)),
              );
            });
          }),
        ).then((files) =>
          files.reduce((acc, curr) => {
            if (Array.isArray(curr)) {
              return [...acc, ...curr];
            }

            return [...acc, curr];
          }, []),
        ),
      );
    });
  });
}

getFiles(docsFolder).then((files) =>
  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve) => {
          const name = file.substr(docsFolder.length + 1);
          console.log(`Validating ${name}...`);
          swagger.validate(file, null, (err) =>
            resolve({
              name,
              isValid: !err,
            }),
          );
        }),
    ),
  )
    .then((files) => files.filter((file) => !file.isValid))
    .then((files) => {
      if (!files.length) {
        return console.log('\nAll files are valid');
      }

      console.log(`\nThe following files are invalid:\n${files.map(({ name }) => name).join('\n')}`);
    }),
);
