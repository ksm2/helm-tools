export class VersionNotSetError extends Error {
  constructor(filename: string) {
    const message = `Failed to copy version from ${filename}: No "version" set`;
    super(message);
    this.name = VersionNotSetError.name;
  }
}
