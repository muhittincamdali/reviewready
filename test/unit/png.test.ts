import { describe, expect, it } from 'vitest';
import { PngError, readPng } from '../../src/collect/png.js';
import { png } from '../helpers/png.js';

describe('readPng', () => {
  it('reads the size and colour type of an RGB image without transparency', () => {
    expect(readPng(png(1024, 1024))).toEqual({
      width: 1024,
      height: 1024,
      colorType: 2,
      alpha: false,
    });
  });

  it('reports an alpha channel', () => {
    expect(readPng(png(512, 256, { alpha: true }))).toMatchObject({
      width: 512,
      height: 256,
      colorType: 6,
      alpha: true,
    });
  });

  it('reports a tRNS chunk, which makes a colour of an RGB image transparent', () => {
    expect(readPng(png(16, 16, { transparentColor: true }))).toMatchObject({
      colorType: 2,
      alpha: true,
    });
  });

  it('ignores a tRNS chunk after the image data, where PNG does not allow it', () => {
    const image = png(16, 16);
    const iend = image.length - 12;
    const trns = Buffer.from([0, 0, 0, 6, 0x74, 0x52, 0x4e, 0x53, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const late = Buffer.concat([image.subarray(0, iend), trns, image.subarray(iend)]);
    expect(readPng(late).alpha).toBe(false);
  });

  it('rejects files that are not PNG or are cut short', () => {
    expect(() => readPng(Buffer.from('GIF89a'))).toThrow(PngError);
    expect(() => readPng(Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...new Array(40).fill(0)]))).toThrow(
      /not a PNG/,
    );
    expect(() => readPng(png(4, 4).subarray(0, 20))).toThrow(PngError);
  });

  it('stops at a chunk length that runs past the end', () => {
    const image = Buffer.from(png(8, 8).subarray(0, 41));
    image.writeUInt32BE(0xffffffff, 33);
    expect(readPng(image)).toMatchObject({ width: 8, alpha: false });
  });
});
