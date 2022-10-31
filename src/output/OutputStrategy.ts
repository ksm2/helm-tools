export interface OutputStrategy {
  printProperties(properties: { [key: string]: string | undefined }): void;

  printWarning(msg: string): void;

  flush(): Promise<void>;
}
