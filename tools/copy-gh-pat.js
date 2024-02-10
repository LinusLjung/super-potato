/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];

console.log(dir);

const ROOT_FOLDER = path.join(__dirname, '..');

const token = fs.readFileSync(path.join(ROOT_FOLDER, '.github-token.txt')).toString().trim();

const file = path.join(ROOT_FOLDER, dir, '.npmrc');

console.log(file);

let content = fs.readFileSync(file).toString();

content += `\n//npm.pkg.github.com/:_authToken=${token}`;

fs.writeFileSync(file, content);
