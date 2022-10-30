export interface OutputStrategy {
  printProperties(properties: { [key: string]: string }): void;

  printWarning(msg: string): void;

  flush(): Promise<void>;
}
