export interface ChartManifest {
  apiVersion: string;
  name: string;
  version: string;
  kubeVersion?: string | undefined;
  description?: string | undefined;
  type?: 'application' | 'library' | undefined;
  keywords?: string[] | undefined;
  home?: string | undefined;
  sources?: string[] | undefined;
  maintainers?: Maintainer[] | undefined;
  icon?: string | undefined;
  appVersion?: string | undefined;
  deprecated?: boolean | undefined;
  annotations?: { [annotation: string]: string } | undefined;
}

export interface Maintainer {
  name: string;
  email?: string | undefined;
  url?: string | undefined;
}
