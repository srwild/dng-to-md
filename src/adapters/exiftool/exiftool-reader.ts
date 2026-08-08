import { ExifTool } from 'exiftool-vendored';

type ExifToolProcess = Pick<ExifTool, 'end'>;

/** Owns the ExifTool process lifecycle without exposing ExifTool tags to core code. */
export class ExifToolAdapter {
  readonly #process: ExifToolProcess;

  constructor(process: ExifToolProcess = new ExifTool({ maxProcs: 1 })) {
    this.#process = process;
  }

  async close(): Promise<void> {
    await this.#process.end();
  }
}
