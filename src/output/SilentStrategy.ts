import type { OutputStrategy } from './OutputStrategy.js';

export class SilentStrategy implements OutputStrategy {
  printProperties(_record: { [key: string]: string | undefined }): void {}

  printWarning(_msg: string): void {}

  async flush(): Promise<void> {}
}
