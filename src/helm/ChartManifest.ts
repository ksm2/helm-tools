export interface ChartManifest {
  apiVersion: string;
  name: string;
  version: string;
  appVersion?: string;
  description?: string;
  type?: string;
  deprecated?: boolean;
  annotations?: { [annotation: string]: string };
}
