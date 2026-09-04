import fs from 'node:fs';
import { distDir, fail } from './common.mjs';

export function validateSecurity() {
  const errors = [];
  const files = fs.existsSync(distDir) ? fs.readdirSync(distDir, { recursive: true }) : [];
  const forbidden = [/\bsk-(?:proj|live|test)-[A-Za-z0-9_-]{20,}/, /-----BEGIN (RSA|OPENSSH|EC|PRIVATE) KEY-----/, /password\s*[:=]/i, /api[_-]?key\s*[:=]/i, /app\.notion\.com\//i, /localhost:\d+/i];
  for (const file of files) {
    const target = distDir + '/' + file;
    if (!fs.statSync(target).isFile()) continue;
    const text = fs.readFileSync(target, 'utf8');
    for (const pattern of forbidden) if (pattern.test(text)) errors.push(String(file) + ': forbidden sensitive content pattern ' + pattern);
  }
  fail(errors);
  return 'generated output contains no blocked sensitive patterns';
}
