#!/usr/bin/env node

import { zip } from "./zip";

const isOK = process.argv.length > 2;
if (!isOK) {
  console.error('You must provide a zambda conf file!');
  process.exit(1);
}

// Zip!
const confFile = process.argv[2];
zip(confFile)
  .then(function handler(): void {
    console.log('Zambda archive for conf: ' + confFile + ' has been generated!');
    process.exit(0);
  })
  .catch(e => {
    console.error(e + '');
    process.exit(1);
  });
