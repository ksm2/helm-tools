export class ChartDoesNotExistError extends Error {
  constructor(folder: string) {
    const message = `Could not find a Helm Chart at ${folder}`;
    super(message);
    this.name = ChartDoesNotExistError.name;
  }
}
