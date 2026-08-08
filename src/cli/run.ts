import { parseArgs } from 'node:util';

export interface CliIo {
  readonly stdout: (message: string) => void;
  readonly stderr: (message: string) => void;
}

const helpText = `Usage: dng-to-md [options]

Generate Markdown from normalized DNG metadata.

Options:
  -h, --help     Show this help message
  -v, --version  Show the installed version

Metadata extraction and Markdown generation are not implemented yet.
`;

export function runCli(args: readonly string[], version: string, io: CliIo): number {
  try {
    const { values, positionals } = parseArgs({
      args: [...args],
      allowPositionals: true,
      strict: true,
      options: {
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
      },
    });

    if (values.version === true) {
      io.stdout(`${version}\n`);
      return 0;
    }

    if (values.help === true || positionals.length === 0) {
      io.stdout(helpText);
      return 0;
    }

    io.stderr('Error: DNG processing is not implemented yet. Run dng-to-md --help for usage.\n');
    return 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid command-line arguments.';
    io.stderr(`Error: ${message}\nRun dng-to-md --help for usage.\n`);
    return 2;
  }
}
