import { describe, expect, it, vi } from 'vitest';

import { ExifToolAdapter } from '../../../../src/adapters/exiftool/exiftool-reader.js';

describe('ExifToolAdapter', () => {
  it('awaits ExifTool shutdown', async () => {
    const end = vi.fn().mockResolvedValue(undefined);
    const adapter = new ExifToolAdapter({ read: vi.fn(), end });

    await adapter.close();

    expect(end).toHaveBeenCalledOnce();
  });

  it('requests numeric technical tags and returns normalized metadata without closing', async () => {
    const read = vi.fn().mockResolvedValue({ Make: ' Canon ', ExposureTime: 0.002, GPSLatitude: 40 });
    const end = vi.fn();
    const adapter = new ExifToolAdapter({ read, end });

    await expect(adapter.read('photo.dng', 'dng')).resolves.toEqual({
      format: 'dng', cameraMake: 'Canon', exposureTime: 0.002,
    });
    expect(read).toHaveBeenCalledExactlyOnceWith('photo.dng', {
      numericTags: ['ImageWidth', 'ImageHeight', 'ExposureTime', 'FNumber', 'ISO', 'FocalLength'],
    });
    expect(end).not.toHaveBeenCalled();
  });

  it('propagates extraction failures and leaves shutdown to the caller', async () => {
    const error = new Error('Cannot read image');
    const end = vi.fn();
    const adapter = new ExifToolAdapter({ read: vi.fn().mockRejectedValue(error), end });

    await expect(adapter.read('missing.dng', 'dng')).rejects.toBe(error);
    expect(end).not.toHaveBeenCalled();
  });

  it('does not finish closing before the process ends', async () => {
    let finish = (): void => { throw new Error('Shutdown has not started'); };
    const pending = new Promise<void>((resolve) => { finish = resolve; });
    const adapter = new ExifToolAdapter({ read: vi.fn(), end: vi.fn().mockReturnValue(pending) });
    const closed = vi.fn();
    const closing = adapter.close().then(closed);

    await Promise.resolve();
    expect(closed).not.toHaveBeenCalled();
    finish();
    await closing;
    expect(closed).toHaveBeenCalledOnce();
  });
});
