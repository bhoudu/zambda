import { zipWithConf } from './zip';

describe('zip.ts', () => {
  it('should zip file from given json conf', async () => {
    const result = await zipWithConf({
      workDir: 'test-folder',
      zip: {
        name: 'test.zip',
        files: [
          {
            source: 'README.md',
          },
          {
            source: 'package.json',
            destination: 'subpath/package.json',
          },
        ],
        folders: [
          'resources',
          {
            source: 'src',
            destination: 'subpath/src',
          },
        ],
      },
    });
    expect(result).toBeTruthy();
  }, 10000);
});
