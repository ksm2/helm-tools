import fs from 'node:fs/promises';
import path from 'node:path';
import { Document, parseDocument, Scalar } from 'yaml';
import { formatDate } from './formatDate';
import { groupBy } from './groupBy';
import { IndexEntry } from './IndexEntry';
import { readStringFile } from './readStringFile';

export class Index {
  private readonly entries: IndexEntry[];

  constructor(entries: IndexEntry[]) {
    this.entries = entries;
  }

  static async readFromFolder(folder: string): Promise<Index | undefined> {
    const manifestPath = this.resolveManifest(folder);
    const manifestStr = await readStringFile(manifestPath);
    if (manifestStr === undefined) return undefined;

    const manifestDoc = parseDocument(manifestStr);
    const { entries = {} } = manifestDoc.toJS();

    return new Index(Object.values(entries).flat(1) as IndexEntry[]);
  }

  async writeToFolder(folder: string): Promise<void> {
    const manifestPath = Index.resolveManifest(folder);
    const manifestStr = this.toString();
    await fs.writeFile(manifestPath, manifestStr);
  }

  private static resolveManifest(folder: string): string {
    return path.resolve(folder, 'index.yaml');
  }

  addEntry(entry: IndexEntry): this {
    const index = this.entries.findIndex(
      (e) => e.name === entry.name && e.version === entry.version,
    );
    if (index < 0) {
      this.entries.push(entry);
    } else {
      this.entries[index] = entry;
    }
    return this;
  }

  toString(): string {
    const file = {
      apiVersion: 'v1',
      generated: Index.doubleQuotedString(formatDate(new Date())),
      entries: this.normalizeEntries(),
    };

    const document = new Document(file);
    return document.toString();
  }

  private normalizeEntries(): unknown {
    return groupBy(
      this.entries.map((entry) => ({
        apiVersion: entry.apiVersion,
        name: entry.name,
        version: entry.version,
        appVersion: entry.appVersion,
        description: entry.description,
        type: entry.type,
        deprecated: entry.deprecated,
        created: Index.doubleQuotedString(entry.created),
        digest: entry.digest,
        urls: entry.urls,
      })),
      (value) => value.name,
    );
  }

  private static doubleQuotedString(str: string): Scalar {
    const scalar = new Scalar(str);
    scalar.type = Scalar.QUOTE_DOUBLE;
    return scalar;
  }
}
