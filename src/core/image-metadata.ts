export type SupportedImageFormat = 'dng';

/**
 * Normalized metadata that is safe for application code to consume.
 * Only explicitly allowed fields cross the metadata adapter boundary.
 */
export interface ImageMetadata {
  readonly format: SupportedImageFormat;
  readonly cameraMake?: string;
  readonly cameraModel?: string;
  readonly lens?: string;
  readonly title?: string;
  readonly caption?: string;
  readonly copyright?: string;
  readonly width?: number;
  readonly height?: number;
  /** Exposure duration in seconds. */
  readonly exposureTime?: number;
  /** Aperture f-number. */
  readonly aperture?: number;
  readonly iso?: number;
  /** Focal length in millimeters. */
  readonly focalLength?: number;
  readonly keywords?: readonly string[];
}
