import { describe, expect, it } from 'vitest';

import { normalizeExifToolTags } from '../../../../src/adapters/exiftool/normalize-exiftool-tags.js';

describe('normalizeExifToolTags', () => {
  it('maps all supported fields and prefers XMP authoring metadata', () => {
    expect(normalizeExifToolTags({
      Make: ' Canon ', Model: 'R5', LensModel: '24-70mm',
      ImageWidth: 6000, ImageHeight: 4000, ExposureTime: 0.002,
      FNumber: 2.8, ISO: 100, FocalLength: 35,
      Title: ' Title ', ObjectName: 'IPTC title',
      Description: ' First line\nSecond line ', 'Caption-Abstract': 'IPTC caption',
      ImageDescription: 'EXIF caption', Rights: 'Copyright XMP',
      CopyrightNotice: 'Copyright IPTC', Copyright: 'Copyright EXIF',
      Subject: [' landscape ', 'landscape', '', 'Landscape', 'sea, sky'], Keywords: ['fallback'],
    })).toEqual({
      format: 'dng', cameraMake: 'Canon', cameraModel: 'R5', lens: '24-70mm',
      width: 6000, height: 4000, exposureTime: 0.002, aperture: 2.8, iso: 100, focalLength: 35,
      title: 'Title', caption: 'First line\nSecond line', copyright: 'Copyright XMP',
      keywords: ['landscape', 'Landscape', 'sea, sky'],
    });
  });

  it('falls back to usable IPTC fields', () => {
    expect(normalizeExifToolTags({
      Title: ' ', ObjectName: ' Title ', Description: 42, 'Caption-Abstract': 'Caption',
      Rights: null, CopyrightNotice: 'Copyright', Subject: ['', 42], Keywords: 'sea, sky',
    })).toEqual({
      format: 'dng', title: 'Title', caption: 'Caption', copyright: 'Copyright', keywords: ['sea, sky'],
    });
  });

  it('falls back to applicable EXIF fields', () => {
    expect(normalizeExifToolTags({
      Description: '', 'Caption-Abstract': ' ', ImageDescription: 'Caption',
      Rights: [], CopyrightNotice: '', Copyright: 'Copyright',
    })).toEqual({ format: 'dng', caption: 'Caption', copyright: 'Copyright' });
  });

  it('omits missing fields', () => {
    expect(normalizeExifToolTags({})).toEqual({ format: 'dng' });
  });

  it.each([0, -1, NaN, Infinity, -Infinity, '100', null, undefined, {}, []])(
    'omits invalid numeric values (%j)', (value) => {
      expect(normalizeExifToolTags({
        ImageWidth: value, ImageHeight: value, ExposureTime: value,
        FNumber: value, ISO: value, FocalLength: value,
      })).toEqual({ format: 'dng' });
    },
  );

  it('requires integer dimensions and ISO but allows fractional exposure settings', () => {
    expect(normalizeExifToolTags({
      ImageWidth: 1.5, ImageHeight: 2.5, ISO: 100.5, ExposureTime: 0.5, FNumber: 2.8, FocalLength: 35.5,
    })).toEqual({ format: 'dng', exposureTime: 0.5, aperture: 2.8, focalLength: 35.5 });
  });

  it('omits invalid text and empty keyword lists', () => {
    expect(normalizeExifToolTags({
      Make: ' ', Model: 123, LensModel: {}, Title: [], Description: null,
      Rights: false, Subject: ['', 42, null], Keywords: ' ',
    })).toEqual({ format: 'dng' });
  });

  it('excludes every unlisted tag and does not mutate its input', () => {
    const subject = Object.freeze([' sky ', 'sky']);
    const tags = Object.freeze({
      Subject: subject, GPSLatitude: 40, GPSLongitude: -74, SerialNumber: '123',
      OwnerName: 'Owner', SourceFile: '/images/photo.dng', ArbitraryTag: 'private',
    });
    expect(normalizeExifToolTags(tags)).toEqual({ format: 'dng', keywords: ['sky'] });
    expect(tags.Subject).toEqual([' sky ', 'sky']);
  });
});
