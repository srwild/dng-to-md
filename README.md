# dng-to-md

`dng-to-md` is an early-stage Node.js CLI package for generating Markdown from normalized DNG image metadata. It is intended for content-authoring workflows, including projects built with Astro or Eleventy, without depending on either framework.

The current release establishes the package architecture and development tooling. Metadata extraction, configuration loading, YAML frontmatter, and Markdown generation are not implemented yet.

## Requirements

- Node.js 22 or newer
- Perl on macOS and Linux, as required by the vendored ExifTool distribution

## Development

```sh
npm install
npm test
npm run typecheck
npm run lint
npm run build
```

After building, run the CLI help locally:

```sh
node dist/cli.js --help
```

## Architecture

- `src/core` contains format-neutral contracts and orchestration.
- `src/adapters/exiftool` owns ExifTool-specific behavior and process cleanup.
- `src/cli` owns arguments and user-facing terminal output.
- `tests/unit` does not invoke ExifTool.
- `tests/integration` is reserved for a small set of real DNG tests.
- `tests/fixtures/exiftool` stores reviewed JSON for metadata mapping tests.

Normalized metadata will use an explicit allowlist. Raw ExifTool output will not be passed to Markdown generation, preventing accidental publication of fields such as GPS coordinates, camera serial numbers, or owner information.

## License

Project code is available under the MIT License. See `THIRD_PARTY_NOTICES.md` for ExifTool licensing information.
