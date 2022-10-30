import { fs, vol } from 'memfs';
import { GithubStrategy } from '../../src/output/GithubStrategy';

const outputFile = '/tmp/gh-output';
vol.fromJSON({ [outputFile]: '' });
jest.mock('node:fs', () => fs);

describe('GithubStrategy', () => {
  let s: GithubStrategy;

  beforeEach(async () => {
    process.env['GITHUB_OUTPUT'] = outputFile;
    s = new GithubStrategy();
  });

  describe('printProperties', () => {
    it('should format an empty object', async () => {
      s.printProperties({});
      await s.flush();
      expect(fs.readFileSync(outputFile, 'utf-8')).toBe('');
    });

    it('should format an object with one entry', async () => {
      s.printProperties({ loremIpsum: 'dolor sit amet' });
      await s.flush();
      expect(fs.readFileSync(outputFile, 'utf-8')).toBe('lorem-ipsum=dolor sit amet\n');
    });

    it('should format an object with multiple entries', async () => {
      s.printProperties({ a: '1', b: '2', c: '3' });
      await s.flush();
      expect(fs.readFileSync(outputFile, 'utf-8')).toBe('a=1\nb=2\nc=3\n');
    });
  });
});
