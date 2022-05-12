import { exec } from 'child_process';
import { workspaces } from '../package.json';

workspaces.forEach((workspace) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { name } = require(`../${workspace}/package.json`);
  console.log(`Installing ${name}`);

  exec(`cd ${workspace} && npm i`, (error, stdOut, stdErr) => {
    if (error) {
      console.error(`Error installing ${workspace}`, error);
    }

    console.log(`###${workspace}###`);
    console.log(stdOut);
    console.log(stdErr);
  });
});
