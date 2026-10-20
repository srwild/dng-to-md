import type { ImageMetadata } from '../../core/image-metadata.js';

function text(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() || undefined : undefined;
}

function keywords(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(values.map(text).filter((entry): entry is string => entry !== undefined))];
}

/** Copies only allowlisted values; raw tags never reach application code. */
export function normalizeExifToolTags(input: object): ImageMetadata {
  const tags = input as Readonly<Record<string, unknown>>;
  const metadata: { -readonly [K in keyof ImageMetadata]: ImageMetadata[K] } = { format: 'dng' };

  const textFields = {
    cameraMake: ['Make'],
    cameraModel: ['Model'],
    lens: ['LensModel'],
    title: ['Title', 'ObjectName'],
    caption: ['Description', 'Caption-Abstract', 'ImageDescription'],
    copyright: ['Rights', 'CopyrightNotice', 'Copyright'],
  } as const;

  for (const field of Object.keys(textFields) as (keyof typeof textFields)[]) {
    for (const tag of textFields[field]) {
      const value = text(tags[tag]);
      if (value !== undefined) {
        metadata[field] = value;
        break;
      }
    }
  }

  const numberFields = {
    width: 'ImageWidth',
    height: 'ImageHeight',
    exposureTime: 'ExposureTime',
    aperture: 'FNumber',
    iso: 'ISO',
    focalLength: 'FocalLength',
  } as const;

  for (const field of Object.keys(numberFields) as (keyof typeof numberFields)[]) {
    const value = tags[numberFields[field]];
    const integerRequired = field === 'width' || field === 'height' || field === 'iso';
    if (
      typeof value === 'number' && Number.isFinite(value) && value > 0 &&
      (!integerRequired || Number.isInteger(value))
    ) {
      metadata[field] = value;
    }
  }

  for (const tag of ['Subject', 'Keywords']) {
    const values = keywords(tags[tag]);
    if (values.length > 0) {
      metadata.keywords = values;
      break;
    }
  }

  return metadata;
}
