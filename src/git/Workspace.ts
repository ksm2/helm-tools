import type { Git } from './Git.js';

export class Workspace {
  private readonly git: Git;
  private readonly folder: string;

  constructor(git: Git, folder: string) {
    this.git = git;
    this.folder = folder;
  }

  async add(...paths: string[]) {
    await this.git.run(this.folder, 'add', ...paths);
  }
}
