import type { ChartManifest } from './ChartManifest.js';

export interface IndexEntry extends ChartManifest {
  created: string;
  digest: string;
  urls: string[];
}
