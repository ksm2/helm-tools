import { createOutputStrategy } from './createOutputStrategy';
import { OutputStrategy } from './OutputStrategy';

export class Output implements OutputStrategy {
  private strategy: OutputStrategy;

  constructor() {
    this.strategy = createOutputStrategy('auto');
  }

  set format(format: string) {
    this.strategy = createOutputStrategy(format);
  }

  printProperties(properties: { [key: string]: string }): void {
    this.strategy.printProperties(properties);
  }

  printWarning(str: string): void {
    this.strategy.printWarning(str);
  }

  flush(): Promise<void> {
    return this.strategy.flush();
  }
}
