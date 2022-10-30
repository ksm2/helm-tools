import fs from 'node:fs/promises';

export async function readStringFile(filepath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filepath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return undefined;
    } else {
      throw error;
    }
  }
}
