export class UnsupportedImageFormatError extends Error {
  override readonly name = 'UnsupportedImageFormatError';

  constructor(filePath: string) {
    super(`Unsupported image format: ${filePath}. Only DNG files are supported.`);
  }
}
