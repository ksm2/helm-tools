export class Permission {
  private readonly mode: number;

  constructor(mode: number) {
    this.mode = mode & 0o7;
  }

  get readable(): boolean {
    return Boolean(this.mode & 0o4);
  }

  get writable(): boolean {
    return Boolean(this.mode & 0o2);
  }

  get executable(): boolean {
    return Boolean(this.mode & 0o1);
  }

  toString(): string {
    return `${this.readable ? 'r' : '-'}${this.writable ? 'w' : '-'}${this.executable ? 'x' : '-'}`;
  }
}
