import crypto from 'node:crypto';
import { Transform, type TransformCallback } from 'node:stream';

export class DigestStream extends Transform {
  private hash: crypto.Hash;

  constructor(algorithm: string) {
    super();
    this.hash = crypto.createHash(algorithm);
  }

  override _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.hash.update(chunk);
    this.push(chunk);
    callback();
  }

  digest(): string {
    return this.hash.digest().toString('hex');
  }
}
