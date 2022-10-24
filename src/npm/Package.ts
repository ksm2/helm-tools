import fs from 'node:fs/promises';
import path from 'node:path';
import { PackageManifest } from './PackageManifest';

export class Package {
  private readonly manifest: PackageManifest;

  constructor(manifest: PackageManifest) {
    this.manifest = manifest;
  }

  get description(): string | undefined {
    return this.manifest.description;
  }

  get version(): string | undefined {
    return this.manifest.version;
  }

  static async readFromFolder(folder: string): Promise<Package> {
    const manifestPath = this.resolveManifest(folder);
    const manifestStr = await fs.readFile(manifestPath, 'utf-8');
    const manifestDoc = JSON.parse(manifestStr);
    return new Package(manifestDoc);
  }

  private static resolveManifest(folder: string) {
    return path.resolve(folder, 'package.json');
  }
}
