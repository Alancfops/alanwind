#!/usr/bin/env node
// Sets one version on every public package of the monorepo (D142: single
// version for alanwind and @alanwind/*). Usage: set-version.mjs 0.3.0
// Only touches the checkout used by the release job; nothing is committed.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version ?? '')) {
  console.error(`Invalid version: "${version}". Expected X.Y.Z.`);
  process.exit(1);
}

const updated = [];
for (const folder of readdirSync('packages')) {
  const manifestPath = join('packages', folder, 'package.json');
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.private) continue;
  manifest.version = version;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  updated.push(manifest.name);
}

if (updated.length === 0) {
  console.error('No public package found in packages/.');
  process.exit(1);
}
console.log(`Version ${version} set on: ${updated.join(', ')}`);
