import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { finished } from 'node:stream/promises';
import tar from 'tar';
import { Chart } from '../helm/Chart';
import { ChartDoesNotExistError } from './ChartDoesNotExistError';
import { DigestStream } from './DigestStream';
import { writeProperties } from './properties';

export async function pack(chartLocation: string): Promise<void> {
  const cwd = process.cwd();

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  if (chart === undefined) {
    throw new ChartDoesNotExistError(chartFolder);
  }

  const filename = `${chart.name}-${chart.version}.tgz`;
  const ds = new DigestStream('sha256');
  const stream = tar
    .create(
      {
        gzip: true,
        prefix: chart.name,
        cwd: chartFolder,
        portable: true,
      },
      ['.'],
    )
    .pipe(ds)
    .pipe(fs.createWriteStream(filename));

  await finished(stream);

  const digest = ds.digest();
  writeProperties({ filename, digest });
}
