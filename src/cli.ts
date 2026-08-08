#!/usr/bin/env node

import { createRequire } from 'node:module';

import { runCli } from './cli/run.js';

interface PackageMetadata {
  readonly version: string;
}

const require = createRequire(import.meta.url);
const packageMetadata = require('../package.json') as PackageMetadata;

process.exitCode = runCli(process.argv.slice(2), packageMetadata.version, {
  stdout: (message) => process.stdout.write(message),
  stderr: (message) => process.stderr.write(message),
});
