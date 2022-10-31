export interface PackageManifest {
  name: string;
  version?: string;
  description?: string;
  homepage?: string;
  author?: Person | string;
  keywords?: string[];
  repository?: Repository | string;
}

export interface Person {
  name: string;
  email?: string;
  url?: string;
}

export interface Repository {
  type?: string;
  url?: string;
  directory?: string;
}
