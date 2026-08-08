import type { ImageMetadata } from '../../core/image-metadata.js';

/**
 * This boundary intentionally accepts no raw tags until the metadata allowlist
 * is defined. It prevents accidental passthrough of sensitive EXIF fields.
 */
export function createEmptyDngMetadata(): ImageMetadata {
  return { format: 'dng' };
}
