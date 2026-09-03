import { validateContracts } from './validators/contracts.mjs';
import { validatePublication } from './validators/publication.mjs';
import { validateIA } from './validators/ia.mjs';
import { validateAssets } from './validators/assets.mjs';

for (const [name, fn] of Object.entries({ contracts: validateContracts, publication: validatePublication, ia: validateIA, assets: validateAssets })) {
  try {
    console.log('[pass] ' + name + ': ' + fn());
  } catch (error) {
    console.error('[fail] ' + name + ': ' + error.message);
    process.exitCode = 1;
  }
}
