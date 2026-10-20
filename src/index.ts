export { UnsupportedImageFormatError } from './core/errors.js';
export { ExifToolAdapter } from './adapters/exiftool/exiftool-reader.js';
export type { ImageMetadata, SupportedImageFormat } from './core/image-metadata.js';
export type { MetadataReader } from './core/metadata-reader.js';
export { detectImageFormat, readImageMetadata } from './core/read-image-metadata.js';
