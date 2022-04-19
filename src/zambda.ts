#!/usr/bin/env node
import { zipWithConf } from "./zip";
import { parseZambdaConfig } from "./config";

const isOK = process.argv.length > 2;
if (!isOK) {
  console.error('You must provide a zambda conf file!');
  process.exit(1);
}

// Zip!
const confFilePath = process.argv[2];
const S3Suffix = process.argv.length > 3 ? process.argv[3] : '';
const zambdaConfig = parseZambdaConfig(confFilePath);
zipWithConf(zambdaConfig)
  .then(function handler(): void {
    console.log('Zambda archive for conf: ' + confFilePath + ' has been generated!');
    process.exit(0);
  })
  .catch(e => {
    console.error(e + '');
    process.exit(1);
  });
