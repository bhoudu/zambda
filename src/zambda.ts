#!/usr/bin/env node
import fs from 'fs';
import { getWorkPath, parseZambdaConfig } from './config';
import { zipWithConf } from './zip';
import { pushS3 } from './s3';
import { S3 } from '@aws-sdk/client-s3';

const isOK = process.argv.length > 2;
if (!isOK) {
  console.error('You must provide a zambda conf file!');
  process.exit(1);
}

// Zip!
const confFilePath = process.argv[2];
const S3Suffix = process.argv.length > 3 ? '-' + process.argv[3] : '';
const zambdaConfig = parseZambdaConfig(confFilePath);
zipWithConf(zambdaConfig)
  .then(async function handler(): Promise<void> {
    console.log('Zambda archive for conf: ' + confFilePath + ' has been generated!');
    // EXPERIMENTAL, NOT READY YET
    if (zambdaConfig.s3) {
      const s3 = new S3({});
      const destinationPath = getWorkPath(zambdaConfig) + zambdaConfig.zip.name;
      const readStream = fs.createReadStream(destinationPath, 'utf8');
      const s3key = zambdaConfig.s3.destination + S3Suffix;
      await pushS3(s3, zambdaConfig.s3.bucketName, s3key, readStream);
    }
    process.exit(0);
  })
  .catch((e) => {
    console.error(e + '');
    process.exit(1);
  });
