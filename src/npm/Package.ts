import fs from 'node:fs/promises';
import path from 'node:path';
import type { PackageManifest, Person } from './PackageManifest.js';

export class Package {
  readonly manifest: PackageManifest;

  constructor(manifest: PackageManifest) {
    this.manifest = manifest;
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

  get author(): Person | undefined {
    if (typeof this.manifest.author === 'string') {
      return Package.parsePersonString(this.manifest.author);
    } else if (this.manifest.author !== undefined) {
      return this.manifest.author;
    } else {
      return undefined;
    }
  }

  private static parsePersonString(str: string): Person {
    const match = str.match(/^(?<name>.*?)\s*<(?<email>.*)>$/);
    if (match !== null) {
      return match.groups as { name: string; email: string };
    }
    return { name: str };
  }
}
