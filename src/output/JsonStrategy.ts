import { OutputStrategy } from './OutputStrategy';

export class JsonStrategy implements OutputStrategy {
  printProperties(properties: { [p: string]: string }): void {
    process.stdout.write(JSON.stringify(properties) + '\n');
  }

  printWarning(msg: string): void {
    process.stderr.write(`Warning: ${msg}\n`);
  }

  async flush(): Promise<void> {}
}
