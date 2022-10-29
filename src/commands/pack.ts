import path from 'node:path';
import process from 'node:process';
import { Chart } from '../helm/Chart';
import { ChartArchive } from '../helm/ChartArchive';
import { ChartDoesNotExistError } from './ChartDoesNotExistError';
import { writeProperties } from './properties';

export async function pack(chartLocation: string): Promise<void> {
  const cwd = process.cwd();

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  if (chart === undefined) {
    throw new ChartDoesNotExistError(chartFolder);
  }

  const archive = ChartArchive.create(chart, chartFolder);

  const filename = `${chart.name}-${chart.version}.tgz`;
  const digest = await archive.writeToFile(filename);

  writeProperties({ filename, digest });
}
