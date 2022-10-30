import path from 'node:path';
import process from 'node:process';
import semver from 'semver/preload';
import { Git } from '../git/Git';
import { Workspace } from '../git/Workspace';
import { Chart } from '../helm/Chart';
import { Package } from '../npm/Package';
import { Output } from '../output/Output';
import { ChartDoesNotExistError } from './ChartDoesNotExistError';
import { VersionNotSetError } from './VersionNotSetError';

export async function bump(output: Output, chartLocation: string): Promise<void> {
  const cwd = process.cwd();

  const pkg = await Package.readFromFolder(cwd);
  if (pkg.version === undefined) {
    throw new VersionNotSetError(cwd);
  }

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  if (chart === undefined) {
    throw new ChartDoesNotExistError(chartFolder);
  }

  chart.appVersion = pkg.version;
  chart.description = pkg.description;

  chart.version = semver.inc(chart.version, 'minor')!;

  await chart.writeToFolder(chartFolder);

  const git = await Git.fromEnv();
  const ws = new Workspace(git, cwd);
  await ws.add(Chart.resolveManifest(chartLocation));

  output.printProperties({
    chartName: chart.name,
    chartVersion: chart.version,
    appVersion: chart.appVersion,
  });
}
