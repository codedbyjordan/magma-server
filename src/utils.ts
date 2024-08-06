import { CONTINUE_BIT, SEGMENT_BITS } from "./constants";

export const textEncoder = new TextEncoder();
export const textDecoder = new TextDecoder();

export function intToVarInt(value: number): Buffer {
  const arr = [];
  let index = 0;

  do {
    let byte = value & SEGMENT_BITS;
    value >>>= 7;
    if (value !== 0) {
      byte |= CONTINUE_BIT;
    }
    arr[index++] = byte;
  } while (value !== 0);

  return Buffer.from(arr);
}
