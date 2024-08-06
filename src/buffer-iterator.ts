export class BufferIterator {
  buffer: Buffer;
  index: number;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.index = 0;
  }

  next(): number | null {
    if (this.index + 1 > this.buffer.length) return null;
    return this.buffer[this.index++];
  }

  peek(): number | null {
    if (this.index + 1 > this.buffer.length) return null;
    return this.buffer[this.index + 1];
  }
}
