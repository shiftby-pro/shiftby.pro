import fs from 'node:fs';
import { manifest, distDir, fail } from './common.mjs';

export function validateRelease() {
  const errors = [];
  if (!manifest.version) errors.push('manifest version missing');
  if (!manifest.records.length) errors.push('manifest has no records');
  if (!fs.existsSync(distDir)) errors.push('dist directory missing');
  if (!process.env.GITHUB_SHA && process.env.CI) errors.push('GITHUB_SHA missing in CI');
  fail(errors);
  return process.env.GITHUB_SHA ? 'release checks bound to ' + process.env.GITHUB_SHA.slice(0, 12) : 'local release checks pass';
}
