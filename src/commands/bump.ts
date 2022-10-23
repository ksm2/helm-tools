import path from 'path';
import process from 'process';
import semver from 'semver/preload';
import { Chart } from '../helm/Chart';
import { Package } from '../npm/Package';
import { VersionNotSetError } from './VersionNotSetError';

export async function bump(chartLocation: string): Promise<void> {
  const cwd = process.cwd();

  const pkg = await Package.readFromFolder(cwd);
  if (pkg.version === undefined) {
    throw new VersionNotSetError(cwd);
  }

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  chart.appVersion = pkg.version;
  chart.description = pkg.description;

  chart.version = semver.inc(chart.version, 'minor')!;

  await chart.writeToFolder(chartFolder);
}
