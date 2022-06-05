import fs from 'fs';
import archiver from 'archiver';
import * as mkdirp from 'mkdirp';
import { getWorkPath, parseZambdaConfig, ZambdaConfig, ZambdaFile } from './config';

/**
 * Generates a zip file based on zambda configuration
 *
 * @param zambdaConfig that defines zip file to create
 */
export function zipWithConf(zambdaConfig: ZambdaConfig): Promise<boolean> {
  // Define workPath
  const workPath = getWorkPath(zambdaConfig);
  return new Promise((resolve, reject) => {
    // Create work dir
    mkdirp.sync(workPath);

    // Define target zip file
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

    // Append files
    zambdaConfig.zip?.files.forEach((f) => {
      const filePath = f.source;
      const fileName = f.destination ? f.destination : f.source;
      archive.file(filePath, { name: fileName });
    });

    // Append folders
    zambdaConfig.zip?.folders.forEach((f) => {
      const isString = typeof f === 'string' || f instanceof String;
      if (isString) {
        const folder = f as string;
        const directory = folder.endsWith('/') ? f : f + '/';
        const destination = folder.endsWith('/') ? folder.substring(0, folder.length - 1) : folder;
        archive.directory(directory, destination);
      } else {
        const zambdaFile = f as ZambdaFile;
        const source = zambdaFile.source.endsWith('/') ? zambdaFile.source : zambdaFile.source + '/';
        const destination = zambdaFile.destination.endsWith('/')
          ? zambdaFile.destination.substring(0, zambdaFile.destination.length - 1)
          : zambdaFile.destination;
        archive.directory(source, destination);
      }
    });

    // Pipe all the files
    archive.pipe(output);

    // Do the archive!
    archive.finalize();
  });
}

/**
 * Generates zip from zambda conf file that is defined at given file path
 *
 * @param configFilePath to zambda conf file in JSON format
 */
export async function zip(configFilePath: string): Promise<boolean> {
  const zambdaConfig = parseZambdaConfig(configFilePath);
  return zipWithConf(zambdaConfig).then(() => {
    console.log('gfg');
    return true;
  });
}
