import { Permission } from './Permission.js';

export class Mode {
  readonly user: Permission;
  readonly group: Permission;
  readonly other: Permission;

  constructor(mode: number) {
    this.user = new Permission(mode >> 6);
    this.group = new Permission(mode >> 3);
    this.other = new Permission(mode);
  }

  toString(): string {
    return `${this.user}${this.group}${this.other}`;
  }
}
