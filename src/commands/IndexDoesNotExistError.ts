export class IndexDoesNotExistError extends Error {
  constructor(folder: string) {
    const message = `Could not find a Helm Chart Index at ${folder}`;
    super(message);
    this.name = IndexDoesNotExistError.name;
  }
}
