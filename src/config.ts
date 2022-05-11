import fs from 'fs';

export interface ZambdaFile {
  source: string;
  destination?: string;
}

export type ZambdaFolder = string | ZambdaFile;

export interface ZambdaZip {
  name: string;
  folders: ZambdaFolder[];
  files: ZambdaFile[];
}

export interface S3Destination {
  path: string;
  prefix: string;
}

export interface ZambdaS3 {
  bucketName: string;
  destination?: string;
}

export interface ZambdaConfig {
  workDir: string;
  zip: ZambdaZip;
  s3?: ZambdaS3;
}

/**
 * Reads zambda config file from file system and return parsed config object
 *
 * @param configFilePath to read conf from on file system
 */
export function parseZambdaConfig(configFilePath: string): ZambdaConfig {
  const configJson: string = fs.readFileSync(configFilePath, {
    encoding: 'UTF-8',
  });
  if (!configJson) {
    throw new Error('JSON file: ' + configFilePath + ' cannot be read!');
  }
  // Parse configuration
  return JSON.parse(configJson) as ZambdaConfig;
}

/**
 * Returns workPath ending with trailing '/'
 *
 * @param config for zambda
 */
export function getWorkPath(config: ZambdaConfig): string {
  return config.workDir.endsWith('/') ? config.workDir : config.workDir + '/';
}
