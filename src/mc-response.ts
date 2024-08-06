import { BufferIterator } from "./buffer-iterator";
import { CONTINUE_BIT, SEGMENT_BITS } from "./constants";
import { textEncoder } from "./utils";

export class McResponse extends BufferIterator {
  constructor() {
    super(Buffer.alloc(8));
  }

  writeVarInt(value: number): number {
    let length = 0;
    do {
      this.ensureCapacity(1);
      let byte = value & SEGMENT_BITS;
      value >>>= 7;
      if (value !== 0) {
        byte |= CONTINUE_BIT;
      }
      this.buffer[this.index++] = byte;
      length++;
    } while (value !== 0);

    return length;
  }

  writeString(value: string): void {
    const encoded = textEncoder.encode(value);
    this.writeVarInt(value.length);
    this.ensureCapacity(encoded.length);
    this.buffer.set(encoded, this.index);
    this.index += encoded.length;
  }

  ensureCapacity(bytes: number) {
    if (this.index + bytes > this.buffer.length) {
      const newBuf = Buffer.alloc(
        Math.max(this.buffer.length * 2, this.index + bytes)
      );
      this.buffer.copy(newBuf);
      this.buffer = newBuf;
    }
  }

  getBuffer() {
    return this.buffer;
  }
}
