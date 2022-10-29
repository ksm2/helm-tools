import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import tar from 'tar';
import { Chart } from './Chart';
import { DigestStream } from './DigestStream';

export class ChartArchive {
  private readonly ds: DigestStream;
  private readonly readable: Readable;

  constructor(readable: Readable) {
    this.ds = new DigestStream('sha256');
    this.readable = readable.pipe(this.ds);
  }

  static create(chart: Chart, chartFolder: string): ChartArchive {
    return new ChartArchive(
      tar.create(
        {
          gzip: true,
          prefix: chart.name,
          cwd: chartFolder,
          portable: true,
        },
        ['.'],
      ),
    );
  }

  async writeToFile(filename: string): Promise<string> {
    const stream = this.readable.pipe(fs.createWriteStream(filename));
    await finished(stream);
    return this.ds.digest();
  }
}
