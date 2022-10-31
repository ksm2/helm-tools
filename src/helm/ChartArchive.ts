import fs from 'node:fs';
import path from 'node:path';
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
          prefix: chart.manifest.name,
          cwd: chartFolder,
          portable: true,
        },
        ['.'],
      ),
    );
  }

  static read(chartLocation: string): ChartArchive {
    return new ChartArchive(fs.createReadStream(chartLocation));
  }

  digest(): string {
    return this.ds.digest();
  }

  async writeToFile(filename: string): Promise<void> {
    const stream = this.readable.pipe(fs.createWriteStream(filename));
    await finished(stream);
  }

  async readChart(): Promise<Chart> {
    const stream = this.readable.pipe(tar.list());

    let chart: Chart | undefined;
    stream.on('entry', async (entry) => {
      const basename = path.basename(entry.path);
      if (entry.type === 'File' && basename === 'Chart.yaml') {
        const manifestStr = await ChartArchive.readTarEntry(entry);
        chart = Chart.readFromString(manifestStr);
      }
    });

    await finished(stream);
    if (chart === undefined) {
      throw new Error('Provided archive does not contain a Chart manifest');
    }

    return chart;
  }

  private static async readTarEntry(entry: tar.ReadEntry): Promise<string> {
    return new Promise((resolve, reject) => {
      let out = '';
      entry.on('data', (d) => {
        out += d.toString('utf8');
      });
      entry.once('end', () => {
        resolve(out);
      });
      entry.once('error', reject);
    });
  }
}
