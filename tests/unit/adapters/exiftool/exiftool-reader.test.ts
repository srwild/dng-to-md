import { describe, expect, it, vi } from 'vitest';

import { ExifToolAdapter } from '../../../../src/adapters/exiftool/exiftool-reader.js';

describe('ExifToolAdapter', () => {
  it('awaits ExifTool shutdown', async () => {
    const end = vi.fn().mockResolvedValue(undefined);
    const adapter = new ExifToolAdapter({ end });

    await adapter.close();

    expect(end).toHaveBeenCalledOnce();
  });
});
