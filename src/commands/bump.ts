import path from 'node:path';
import process from 'node:process';
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
  if (pkg.manifest.version === undefined) {
    throw new VersionNotSetError(cwd);
  }

  const chartFolder = path.resolve(cwd, chartLocation);
  const chart = await Chart.readFromFolder(chartFolder);
  if (chart === undefined) {
    throw new ChartDoesNotExistError(chartFolder);
  }

  copyPackageToChartManifest(chart, pkg);
  chart.bump('minor');
  await chart.writeToFolder(chartFolder);

  await addChartManifestToGit(cwd, chartFolder);

  const chartName = chart.manifest.name;
  const chartVersion = chart.manifest.version;
  const appVersion = chart.manifest.appVersion;

  output.printProperties({ chartName, chartVersion, appVersion });
}

function copyPackageToChartManifest(chart: Chart, pkg: Package): void {
  chart.manifest.appVersion = pkg.manifest.version;
  chart.manifest.description = pkg.manifest.description;
  chart.manifest.home = pkg.manifest.homepage;
  chart.manifest.keywords = pkg.manifest.keywords;
  copyPackageAuthorToChartMaintainer(chart, pkg);
  copyPackageRepositoryToChartSources(chart, pkg);
}

function copyPackageAuthorToChartMaintainer(chart: Chart, pkg: Package): void {
  const author = pkg.author;
  if (author !== undefined) {
    chart.manifest.maintainers = [author];
  }
}

function copyPackageRepositoryToChartSources(chart: Chart, pkg: Package): void {
  if (typeof pkg.manifest.repository === 'string') {
    chart.manifest.sources = [pkg.manifest.repository];
  } else if (typeof pkg.manifest.repository === 'object') {
    chart.manifest.sources = pkg.manifest.repository.url ? [pkg.manifest.repository.url] : [];
  }
}

async function addChartManifestToGit(cwd: string, chartLocation: string): Promise<void> {
  const git = await Git.fromEnv();
  const ws = new Workspace(git, cwd);
  await ws.add(Chart.resolveManifest(chartLocation));
}
