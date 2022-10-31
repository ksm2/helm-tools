import path from 'node:path';
import process from 'node:process';
import type { Chart } from '../helm/Chart.js';
import { ChartArchive } from '../helm/ChartArchive.js';
import { formatDate } from '../helm/formatDate.js';
import { Index } from '../helm/Index.js';
import type { IndexEntry } from '../helm/IndexEntry.js';
import type { Output } from '../output/Output.js';
import { IndexDoesNotExistError } from './IndexDoesNotExistError.js';

export interface Options {
  chart: string;
  url: string[];
}

export async function indexCommand(o: Output, indexLoc: string, options: Options): Promise<void> {
  const cwd = process.cwd();

  const indexFolder = path.resolve(cwd, indexLoc);
  const index = await Index.readFromFolder(indexFolder);
  if (index === undefined) {
    throw new IndexDoesNotExistError(indexFolder);
  }

  const chartLocation = path.resolve(cwd, options.chart);
  const p = ChartArchive.read(chartLocation);

  const chart = await p.readChart();
  const digest = p.digest();
  const entry = createIndexEntry(chart, digest, options.url);
  index.addEntry(entry);
  await index.writeToFolder(indexFolder);

  const chartName = chart.manifest.name;
  const chartVersion = chart.manifest.version;
  const appVersion = chart.manifest.appVersion;

  o.printProperties({ chartName, chartVersion, appVersion, digest });
}

function createIndexEntry(chart: Chart, digest: string, urls: string[]): IndexEntry {
  const created = formatDate(new Date());
  return { ...chart.manifest, digest, created, urls };
}
