// Writes small PNG files for the icon tests and the fixtures' App Store icons: a solid navy square,
// with a transparent band on the left when it has an alpha channel.
import { deflateSync } from 'node:zlib';

const NAVY = [0x0a, 0x2a, 0x52];

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

export interface PngOptions {
  /** RGBA (colour type 6) instead of RGB (colour type 2). */
  alpha?: boolean;
  /** A tRNS chunk on an RGB image, which makes one colour transparent. */
  transparentColor?: boolean;
}

/** A width × height PNG file. */
export function png(width: number, height: number, options: PngOptions = {}): Buffer {
  const channels = options.alpha ? 4 : 3;
  const row = Buffer.alloc(1 + width * channels);
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = 1 + x * channels;
      row.set(NAVY, offset);
      if (options.alpha) row[offset + 3] = x < width / 8 ? 0 : 255;
    }
    rows.push(Buffer.from(row));
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, options.alpha ? 6 : 2, 0, 0, 0], 8);
  const chunks = [chunk('IHDR', header)];
  if (options.transparentColor)
    chunks.push(chunk('tRNS', Buffer.from([0, 0x0a, 0, 0x2a, 0, 0x52])));
  chunks.push(
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  );
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ...chunks]);
}
