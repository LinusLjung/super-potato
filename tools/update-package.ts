#!/usr/bin/env ts-node
import { exec } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import workspaces from '../workspaces.json';

const { _: inputPackages } = yargs(hideBin(process.argv)).argv;

if (!inputPackages.length) {
  console.log('No packages provided. Exiting.');
  process.exit(0);
}

workspaces.forEach((workspace) => {
  exec(`cd ${workspace} && npm update ${inputPackages.join(' ')}`, (error, stdOut, stdErr) => {
    if (error) {
      console.error(`Error updating ${workspace}`, error);
    }

    console.log(`###${workspace}###`);
    if (stdOut) {
      console.log(stdOut);
    }

    if (stdErr) {
      console.log(stdErr);
    }
  });
});
