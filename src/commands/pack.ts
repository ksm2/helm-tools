import path from 'node:path';
import process from 'node:process';
import { Chart } from '../helm/Chart';
import { ChartArchive } from '../helm/ChartArchive';
import { Output } from '../output/Output';
import { ChartDoesNotExistError } from './ChartDoesNotExistError';

export async function pack(output: Output, chartLocation: string): Promise<void> {
  const cwd = process.cwd();

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  if (chart === undefined) {
    throw new ChartDoesNotExistError(chartFolder);
  }

  const archive = ChartArchive.create(chart, chartFolder);

  const chartName = chart.manifest.name;
  const chartVersion = chart.manifest.version;
  const appVersion = chart.manifest.appVersion;

  const filename = `${chartName}-${chartVersion}.tgz`;
  await archive.writeToFile(filename);
  const digest = archive.digest();

  output.printProperties({ chartName, chartVersion, appVersion, filename, digest });
}
