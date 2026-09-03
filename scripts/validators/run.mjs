import { validateContracts } from './contracts.mjs';
import { validatePublication } from './publication.mjs';
import { validateIA } from './ia.mjs';
import { validateAssets } from './assets.mjs';
import { validateStructural } from './structural.mjs';
import { validateSEO } from './seo.mjs';
import { validateStructuredData } from './structured-data.mjs';
import { validateAccessibility } from './accessibility.mjs';
import { validateSecurity } from './security.mjs';
import { validateLinks } from './links.mjs';
import { validatePerformance } from './performance.mjs';
import { validateRelease } from './release.mjs';

const validators = {
  contracts: validateContracts,
  publication: validatePublication,
  ia: validateIA,
  assets: validateAssets,
  structural: validateStructural,
  seo: validateSEO,
  'structured-data': validateStructuredData,
  accessibility: validateAccessibility,
  security: validateSecurity,
  links: validateLinks,
  performance: validatePerformance,
  release: validateRelease,
};

const names = process.argv.slice(2);
const selected = names.length ? names : Object.keys(validators);
const errors = [];
for (const name of selected) {
  if (!validators[name]) {
    errors.push('unknown validator: ' + name);
    continue;
  }
  try {
    const result = await validators[name]();
    console.log('[pass] ' + name + (result ? ': ' + result : ''));
  } catch (error) {
    errors.push('[fail] ' + name + ': ' + error.message);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
