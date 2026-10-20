import { ExifTool } from 'exiftool-vendored';

import type { ImageMetadata, SupportedImageFormat } from '../../core/image-metadata.js';
import type { MetadataReader } from '../../core/metadata-reader.js';
import { normalizeExifToolTags } from './normalize-exiftool-tags.js';

type ExifToolProcess = Pick<ExifTool, 'read' | 'end'>;

/** Owns the ExifTool process lifecycle without exposing ExifTool tags to core code. */
export class ExifToolAdapter implements MetadataReader {
  readonly #process: ExifToolProcess;

  constructor(process: ExifToolProcess = new ExifTool({ maxProcs: 1 })) {
    this.#process = process;
  }

  async read(filePath: string, format: SupportedImageFormat): Promise<ImageMetadata> {
    const tags = await this.#process.read(filePath, {
      numericTags: ['ImageWidth', 'ImageHeight', 'ExposureTime', 'FNumber', 'ISO', 'FocalLength'],
    });
    return { ...normalizeExifToolTags(tags), format };
  }

  async close(): Promise<void> {
    await this.#process.end();
  }
}
