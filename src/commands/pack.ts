import path from 'node:path';
import process from 'node:process';
import tar from 'tar';
import { Chart } from '../helm/Chart';
import { ChartDoesNotExistError } from './ChartDoesNotExistError';

export async function pack(chartLocation: string): Promise<void> {
  const cwd = process.cwd();

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  if (chart === undefined) {
    throw new ChartDoesNotExistError(chartFolder);
  }

  const outputName = `${chart.name}-${chart.version}.tgz`;
  await tar.create(
    {
      gzip: true,
      file: outputName,
      prefix: chart.name,
      cwd: chartFolder,
      portable: true,
    },
    ['.'],
  );
}
