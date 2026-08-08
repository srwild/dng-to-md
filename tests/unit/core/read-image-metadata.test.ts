import { describe, expect, it, vi } from 'vitest';

import { UnsupportedImageFormatError } from '../../../src/core/errors.js';
import type { MetadataReader } from '../../../src/core/metadata-reader.js';
import {
  detectImageFormat,
  readImageMetadata,
} from '../../../src/core/read-image-metadata.js';

describe('detectImageFormat', () => {
  it('recognizes DNG extensions without case sensitivity', () => {
    expect(detectImageFormat('/images/photo.DNG')).toBe('dng');
  });

  it('rejects formats that are not supported', () => {
    expect(() => detectImageFormat('/images/photo.jpg')).toThrow(UnsupportedImageFormatError);
  });
});

describe('readImageMetadata', () => {
  it('passes the normalized format to the supplied reader', async () => {
    const read = vi.fn<MetadataReader['read']>().mockResolvedValue({ format: 'dng' });
    const reader: MetadataReader = {
      read,
      close: vi.fn<MetadataReader['close']>().mockResolvedValue(undefined),
    };

    await expect(readImageMetadata('/images/photo.dng', reader)).resolves.toEqual({ format: 'dng' });
    expect(read).toHaveBeenCalledWith('/images/photo.dng', 'dng');
  });
});
