import { describe, expect, it } from 'vitest';

import { runCli } from '../../../src/cli/run.js';

function invoke(args: readonly string[]): { exitCode: number; stderr: string; stdout: string } {
  let stderr = '';
  let stdout = '';

  const exitCode = runCli(args, '1.2.3', {
    stderr: (message) => {
      stderr += message;
    },
    stdout: (message) => {
      stdout += message;
    },
  });

  return { exitCode, stderr, stdout };
}

describe('runCli', () => {
  it('prints understandable help without relying on visual decoration', () => {
    const result = invoke(['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Usage: dng-to-md [options]');
  });

  it('prints the installed version', () => {
    expect(invoke(['--version'])).toEqual({
      exitCode: 0,
      stderr: '',
      stdout: '1.2.3\n',
    });
  });

  it('reports unknown options with a usage hint', () => {
    const result = invoke(['--unknown']);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Error:');
    expect(result.stderr).toContain('Run dng-to-md --help for usage.');
  });
});
