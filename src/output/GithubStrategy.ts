import fs from 'node:fs';
import process from 'node:process';
import { finished } from 'node:stream/promises';
import type { OutputStrategy } from './OutputStrategy.js';

export class GithubStrategy implements OutputStrategy {
  private readonly stream: fs.WriteStream;

  constructor() {
    const outputFile = process.env['GITHUB_OUTPUT'];
    if (!outputFile) {
      throw new Error('Could not use "github" format, are you running inside a GitHub Action?');
    }
    this.stream = fs.createWriteStream(outputFile);
  }

  static isSupported(): boolean {
    return process.env['GITHUB_OUTPUT'] !== undefined;
  }

  printProperties(record: { [key: string]: string | undefined }): void {
    this.stream.write(GithubStrategy.formatProperties(record));
  }

  private static formatProperties(record: { [p: string]: string | undefined }): string {
    return Object.entries(record)
      .filter(([, value]) => value)
      .map(([key, value]) => `${this.toKebab(key)}=${value}\n`)
      .join('');
  }

  private static toKebab(str: string): string {
    return str.replace(/[A-Z]/g, (s) => `-${s.toLowerCase()}`);
  }

  printWarning(msg: string): void {
    process.stdout.write(`::warning::${msg}\n`);
  }

  async flush(): Promise<void> {
    this.stream.end();
    await finished(this.stream);
  }
}
