// Reads what an App Store icon check needs from a PNG file: its size and whether it can hold
// transparency. Only the chunk headers before the image data are read; the pixels are not decoded.

/** The eight bytes every PNG file starts with. */
const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** PNG colour types with an alpha channel: grey with alpha (4) and RGB with alpha (6). */
const ALPHA_COLOR_TYPES = new Set([4, 6]);

/** Chunks read before giving up on finding IDAT; real icons have fewer than ten. */
const MAX_CHUNKS = 64;

export interface PngInfo {
  width: number;
  height: number;
  colorType: number;
  /**
   * Whether the image can hold transparency: an alpha channel (colour type 4 or 6) or a tRNS
   * chunk, which gives grey, RGB or palette images transparent colours.
   */
  alpha: boolean;
}

export class PngError extends Error {
  override name = 'PngError';
}

/** Parses the header chunks of a PNG file. Throws PngError when the bytes are not a PNG. */
export function readPng(bytes: Uint8Array): PngInfo {
  if (bytes.length < 33 || SIGNATURE.some((byte, index) => bytes[index] !== byte)) {
    throw new PngError('is not a PNG file');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const type = (offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
  if (type(12) !== 'IHDR' || view.getUint32(8) !== 13) {
    throw new PngError('has no IHDR chunk where a PNG file has it');
  }
  const info: PngInfo = {
    width: view.getUint32(16),
    height: view.getUint32(20),
    colorType: bytes[25] ?? 0,
    alpha: ALPHA_COLOR_TYPES.has(bytes[25] ?? 0),
  };
  // Signature (8) + IHDR length, type, data and CRC (4 + 4 + 13 + 4).
  let offset = 33;
  for (let count = 0; count < MAX_CHUNKS && offset + 8 <= bytes.length; count += 1) {
    const length = view.getUint32(offset);
    const name = type(offset + 4);
    if (name === 'tRNS') info.alpha = true;
    if (name === 'IDAT' || name === 'IEND') break;
    offset += 12 + length;
  }
  return info;
}
