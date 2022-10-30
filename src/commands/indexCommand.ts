import path from 'node:path';
import process from 'node:process';
import { Chart } from '../helm/Chart';
import { ChartArchive } from '../helm/ChartArchive';
import { formatDate } from '../helm/formatDate';
import { Index } from '../helm/Index';
import { IndexEntry } from '../helm/IndexEntry';
import { IndexDoesNotExistError } from './IndexDoesNotExistError';

export interface IndexOptions {
  chart: string;
  url: string[];
}

export async function indexCommand(indexLocation: string, options: IndexOptions): Promise<void> {
  const cwd = process.cwd();

  const indexFolder = path.resolve(cwd, indexLocation);
  const index = await Index.readFromFolder(indexFolder);
  if (index === undefined) {
    throw new IndexDoesNotExistError(indexFolder);
  }

  const chartLocation = path.resolve(cwd, options.chart);
  const p = ChartArchive.read(chartLocation);

  const chart = await p.readChart();
  const entry = createIndexEntry(chart, p.digest(), options.url);
  index.addEntry(entry);
  await index.writeToFolder(indexFolder);
}

function createIndexEntry(chart: Chart, digest: string, urls: string[]): IndexEntry {
  const created = formatDate(new Date());
  return { ...chart.getManifest(), digest, created, urls };
}
