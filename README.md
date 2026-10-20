# dng-to-md

`dng-to-md` is an early-stage Node.js CLI package for generating Markdown from normalized DNG image metadata. It is intended for content-authoring workflows, including projects built with Astro or Eleventy, without depending on either framework.

The package API extracts normalized metadata from DNG files. CLI processing, configuration loading, YAML frontmatter, and Markdown generation are not implemented yet.

## Package API

```ts
import { ExifToolAdapter, readImageMetadata } from '@srwild/dng-to-md';

const reader = new ExifToolAdapter();
try {
  const metadata = await readImageMetadata('photo.dng', reader);
  console.log(metadata);
} finally {
  await reader.close();
}
```

The result always includes `format: 'dng'`. All other fields are optional:

| Fields | Values |
| --- | --- |
| `cameraMake`, `cameraModel`, `lens` | Trimmed strings |
| `width`, `height` | Positive integer pixel dimensions from ImageWidth/ImageHeight |
| `exposureTime`, `aperture`, `iso`, `focalLength` | Seconds, f-number, integer ISO, millimeters |
| `title`, `caption`, `copyright` | Trimmed authoring text, preserving internal line breaks |
| `keywords` | Ordered, trimmed strings with exact duplicates removed |

Authoring fields prefer XMP, falling back to IPTC, then applicable EXIF fields when values are missing or unusable. Keywords use XMP Subject before IPTC Keywords without merging sources or splitting punctuation. Missing or invalid values are omitted. Text is not escaped for Markdown or YAML.

Only embedded metadata is read; sidecar discovery is not supported. Extraction failures reject the read promise. The caller owns the reader lifecycle and must await `close()`, including after a failed read.

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

Normalized metadata uses an explicit allowlist. Raw ExifTool output is not returned to application code, excluding fields such as GPS coordinates, camera serial numbers, owner information, and source paths. Authoring text is included as supplied and may itself contain identifying information.

## License

Project code is available under the MIT License. See `THIRD_PARTY_NOTICES.md` for ExifTool licensing information.
