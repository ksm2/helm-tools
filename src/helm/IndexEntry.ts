import { ChartManifest } from './ChartManifest';

export interface IndexEntry extends ChartManifest {
  created: string;
  digest: string;
  urls: string[];
}
