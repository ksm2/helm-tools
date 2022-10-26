import crypto from 'node:crypto';
import { Transform, type TransformCallback } from 'node:stream';

export class DigestStream extends Transform {
  private hash: crypto.Hash;

  constructor(algorithm: string) {
    super();
    this.hash = crypto.createHash(algorithm);
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
    this.hash.update(chunk);
    this.push(chunk);
    callback();
  }

  digest(): string {
    return this.hash.digest().toString('hex');
  }
}
