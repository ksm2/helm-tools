import chalk from 'chalk';
import { finished } from 'node:stream/promises';
import type { OutputStrategy } from './OutputStrategy.js';

export class TtyStrategy implements OutputStrategy {
  static isSupported(): boolean {
    return process.stderr.isTTY;
  }

  printProperties(properties: { [p: string]: string | undefined }): void {
    for (const [key, value] of Object.entries(properties)) {
      process.stderr.write(`${chalk.bold(`${TtyStrategy.toWords(key)}:`)} ${value}\n`);
    }
  }

  printWarning(msg: string): void {
    process.stderr.write(chalk.yellow(msg) + '\n');
  }

  async flush(): Promise<void> {
    await finished(process.stderr);
  }

  private static toWords(key: string): string {
    return this.upperCaseFirst(key.replace(/[A-Z]/g, (str) => ` ${str}`));
  }

  private static upperCaseFirst(str: string): string {
    return str ? str[0]!.toUpperCase() + str.slice(1) : str;
  }
}
