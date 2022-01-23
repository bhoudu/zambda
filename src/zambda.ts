#!/usr/bin/env node

import fs from 'fs';
import archiver from 'archiver';

interface ZambdaFile {
  source: string;
  destination: string;
}

type ZambdaFolder = string | ZambdaFile;

interface ZambdaZip {
  name: string;
  folders: ZambdaFolder[];
  files: ZambdaFile[];
}

interface ZambdaConfig {
  workDir: string;
  zip: ZambdaZip;
}

async function zipLambda(
  configFilePath: string,
): Promise<boolean> {
  const configJson: string = fs.readFileSync(configFilePath, {
    encoding: 'UTF-8',
  });
  if (!configJson) {
    throw new Error('JSON file: ' + configFilePath + ' cannot be read!');
  }

  const zambdaConfig = JSON.parse(configJson) as ZambdaConfig;
  const workPath = zambdaConfig.workDir.endsWith('/') ? zambdaConfig.workDir : zambdaConfig.workDir + '/';
  return new Promise((resolve, reject) => {
    const destinationPath = workPath + zambdaConfig.zip.name;

    // Init archive
    const output = fs.createWriteStream(destinationPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });

    // Listeners on zip
    output.on('close', function close(): void {
      console.log(archive.pointer() + ' total bytes');
      resolve(true);
    });
    output.on('end', reject);

    // Listeners on archive
    archive.on('warning', function warn(err): void {
      if (err.code === 'ENOENT') {
        // log warning
        console.warn('Error found: ' + err);
        return;
      }
      reject(err);
    });
    archive.on('error', reject);
    archive.pipe(output);

    // Append files
    zambdaConfig.zip?.files.forEach(f => {
      const filePath = f.source;
      const fileName = !!f.destination ? f.destination : f.source;
      archive.file(filePath, { name: fileName });
    });
    zambdaConfig.zip?.folders.forEach(f => {
      const isString = typeof f === 'string' || f instanceof String;
      if (isString) {
        const folder = f as string;
        const directory = folder.endsWith('/') ? f : f + '/';
        const destination = folder.endsWith('/') ? folder.substring(0, folder.length - 1) : folder;
        archive.directory(directory, destination);
      } else {
        const zambdaFile = f as ZambdaFile;
        const source = zambdaFile.source.endsWith('/') ? zambdaFile.source
          : zambdaFile.source + '/';
        const destination = zambdaFile.destination.endsWith('/') ?
          zambdaFile.destination.substring(0, zambdaFile.destination.length - 1)
          : zambdaFile.destination;
        archive.directory(source, destination);
      }
    });

    // Do the archive!
    archive.finalize();
  });
}

const isOK = process.argv.length > 2;
if (!isOK) {
  console.error('You must provide a zambda conf file!');
  process.exit(1);
}

// Generate package
const confFile = process.argv[2];
zipLambda(confFile).then(function handler(): void {
  console.log('Zambda archive for conf: ' + confFile + ' has been generated!');
}).catch(e => {
  console.error(e + '');
  process.exit(1);
});
