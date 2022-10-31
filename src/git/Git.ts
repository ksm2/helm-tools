import childProcess from 'node:child_process';
import type { Stats } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { Mode } from './Mode.js';
import type { Permission } from './Permission.js';

export class Git {
  private readonly command: string;

  private constructor(command: string) {
    this.command = command;
  }

  static async fromEnv(): Promise<Git> {
    const pathEnv = process.env['PATH'];
    const prefixes = pathEnv?.split(':') ?? [];
    for (const prefix of prefixes) {
      const gitPath = path.join(prefix, 'git');
      if (await this.isGitBinary(gitPath)) {
        return new Git(gitPath);
      }
    }

    throw new Error('Could not find Git in $PATH. Is it installed?');
  }

  static async isGitBinary(path: string): Promise<boolean> {
    try {
      const stats = await fs.stat(path);
      return stats.isFile() && this.isFileExecutable(stats);
    } catch (error) {
      return false;
    }
  }

  private static isFileExecutable(stats: Stats): boolean {
    const permission = this.getUserPermission(stats);
    return permission.readable && permission.executable;
  }

  private static getUserPermission(stats: Stats): Permission {
    const perm = new Mode(stats.mode);
    const userInfo = os.userInfo();
    if (userInfo.uid === stats.uid) {
      return perm.user;
    } else if (userInfo.gid === stats.gid) {
      return perm.group;
    } else {
      return perm.other;
    }
  }

  run(cwd: string, ...args: ReadonlyArray<string>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const cp = childProcess.spawn(this.command, args, { cwd, stdio: 'inherit' });

      cp.on('error', (err) => reject(err));

      cp.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`${[this.command, ...args].join(' ')} finished with exit code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }
}
