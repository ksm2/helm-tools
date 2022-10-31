export interface ChartManifest {
  apiVersion: string;
  name: string;
  version: string;
  kubeVersion?: string;
  description?: string;
  type?: 'application' | 'library';
  keywords?: string[];
  home?: string;
  sources?: string[];
  maintainers?: Maintainer[];
  icon?: string;
  appVersion?: string;
  deprecated?: boolean;
  annotations?: { [annotation: string]: string };
}

export interface Maintainer {
  name: string;
  email?: string;
  url?: string;
}
