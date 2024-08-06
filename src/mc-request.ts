import { BufferIterator } from "./buffer-iterator";
import { CONTINUE_BIT, SEGMENT_BITS } from "./constants";
import { textDecoder } from "./utils";

export class McRequest extends BufferIterator {
  constructor(buffer: Buffer) {
    super(buffer);
  }

  readVarInt(): number {
    let value = 0;
    let position = 0;

    while (true) {
      const currentByte = this.next();
      if (!currentByte) break;
      value |= (currentByte & SEGMENT_BITS) << position;

      if ((currentByte & CONTINUE_BIT) == 0) break;

      position += 7;

      if (position >= 32) throw new Error("VarInt is too big");
    }

    return value;
  }

  readString(): string {
    const strLength = this.next();
    if (!strLength) {
      throw new Error("Could not get string length");
    }
    let i = 0;
    let strBytes = [];
    while (i < strLength) {
      const byte = this.next();
      if (!byte) break;
      strBytes.push(byte);
      i++;
    }

    return textDecoder.decode(Buffer.from(strBytes));
  }

  readShortInt(): number {
    const byte1 = this.next();
    const byte2 = this.next();

    if (!byte1 || !byte2) throw new Error("Error reading ShortInt");

    return (byte1 << 8) | byte2;
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
