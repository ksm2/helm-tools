import { OutputStrategy } from './OutputStrategy';

export class SilentStrategy implements OutputStrategy {
  printProperties(record: { [key: string]: string | undefined }): void {}

  printWarning(msg: string): void {}

  async flush(): Promise<void> {}
}
