import fs from 'node:fs/promises';
import path from 'node:path';
import semver from 'semver';
import { Document, parseDocument } from 'yaml';
import { ChartManifest } from './ChartManifest';
import { readStringFile } from './readStringFile';

export class Chart {
  readonly manifest: ChartManifest;
  private readonly document: Document;

  constructor(manifest: ChartManifest, document?: Document) {
    this.manifest = new Proxy(manifest, {
      set: (target: ChartManifest, key: string | symbol, newValue: any, receiver: any): boolean => {
        if (newValue === undefined) {
          this.document.delete(key);
          return Reflect.deleteProperty(target, key);
        } else {
          this.document.set(key, newValue);
          return Reflect.set(target, key, newValue, receiver);
        }
      },
    });
    this.document = document ?? new Document(manifest);
  }

  static async readFromFolder(folder: string): Promise<Chart | undefined> {
    const manifestPath = this.resolveManifest(folder);
    const manifestStr = await readStringFile(manifestPath);
    if (manifestStr === undefined) return undefined;

    return this.readFromString(manifestStr);
  }

  static readFromString(manifestStr: string): Chart {
    const manifestDoc = parseDocument(manifestStr);
    return new Chart(manifestDoc.toJS(), manifestDoc);
  }

  async writeToFolder(folder: string): Promise<void> {
    const manifestPath = Chart.resolveManifest(folder);
    const manifestStr = this.toString();
    await fs.writeFile(manifestPath, manifestStr);
  }

  static resolveManifest(folder: string): string {
    return path.resolve(folder, 'Chart.yaml');
  }

  toString(): string {
    return this.document.toString();
  }

  bump(release: semver.ReleaseType): void {
    this.manifest.version = semver.inc(this.manifest.version, release)!;
  }
}
