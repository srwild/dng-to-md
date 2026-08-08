import type { ImageMetadata, SupportedImageFormat } from './image-metadata.js';

export interface MetadataReader {
  read(filePath: string, format: SupportedImageFormat): Promise<ImageMetadata>;
  close(): Promise<void>;
}
