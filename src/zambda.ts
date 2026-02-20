#!/usr/bin/env node
import { parseZambdaConfig } from './config';
import { zipWithConf } from './zip';

const isOK = process.argv.length > 2;
if (!isOK) {
  console.error('You must provide a zambda conf file!');
  process.exit(1);
}

// Zip!
const confFilePath = process.argv[2];
const zambdaConfig = parseZambdaConfig(confFilePath);
zipWithConf(zambdaConfig)
  .then(async function handler(): Promise<void> {
    console.log(`Zambda archive for conf: ${confFilePath} has been generated!`);
    process.exit(0);
  })
  .catch((e) => {
    console.error(`${e}`);
    process.exit(1);
  });
