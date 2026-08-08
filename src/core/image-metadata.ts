export type SupportedImageFormat = 'dng';

/**
 * Normalized metadata that is safe for application code to consume.
 * Fields will be added only after the public allowlist is defined.
 */
export interface ImageMetadata {
  readonly format: SupportedImageFormat;
}
