import fs from 'node:fs/promises';
import path from 'node:path';
import { Document, parseDocument } from 'yaml';
import { ChartManifest } from './ChartManifest';
import { readStringFile } from './readStringFile';

export class Chart {
  private readonly manifest: ChartManifest;
  private readonly document: Document;

  constructor(manifest: ChartManifest, document?: Document) {
    this.manifest = manifest;
    this.document = document ?? new Document(manifest);
  }

  get name(): string {
    return this.manifest.name;
  }

  get version(): string {
    return this.manifest.version;
  }

  set version(value: string) {
    this.manifest.version = value;
    this.document.set('version', this.manifest.version);
  }

  get appVersion(): string | undefined {
    return this.manifest.appVersion;
  }

  set appVersion(value: string | undefined) {
    this.setOptionalProperty('appVersion', value);
  }

  get description(): string | undefined {
    return this.manifest.description;
  }

  set description(value: string | undefined) {
    this.setOptionalProperty('description', value);
  }

  getManifest(): ChartManifest {
    return this.manifest;
  }

  private setOptionalProperty(key: 'appVersion' | 'description', value?: string | undefined) {
    if (value === undefined) {
      delete this.manifest[key];
      this.document.delete(key);
    } else {
      this.manifest[key] = value;
      this.document.set(key, value);
    }
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
}
