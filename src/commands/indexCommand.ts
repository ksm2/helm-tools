import path from 'node:path';
import process from 'node:process';
import { Chart } from '../helm/Chart';
import { ChartArchive } from '../helm/ChartArchive';
import { formatDate } from '../helm/formatDate';
import { Index } from '../helm/Index';
import { IndexEntry } from '../helm/IndexEntry';
import { Output } from '../output/Output';
import { IndexDoesNotExistError } from './IndexDoesNotExistError';

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

  o.printProperties({
    name: chart.name,
    version: chart.version,
    digest,
  });
}

function createIndexEntry(chart: Chart, digest: string, urls: string[]): IndexEntry {
  const created = formatDate(new Date());
  return { ...chart.getManifest(), digest, created, urls };
}
