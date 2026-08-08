import { extname } from 'node:path';

import { UnsupportedImageFormatError } from './errors.js';
import type { ImageMetadata, SupportedImageFormat } from './image-metadata.js';
import type { MetadataReader } from './metadata-reader.js';

export function detectImageFormat(filePath: string): SupportedImageFormat {
  if (extname(filePath).toLowerCase() === '.dng') {
    return 'dng';
  }

  throw new UnsupportedImageFormatError(filePath);
}

export async function readImageMetadata(
  filePath: string,
  reader: MetadataReader,
): Promise<ImageMetadata> {
  return reader.read(filePath, detectImageFormat(filePath));
}
