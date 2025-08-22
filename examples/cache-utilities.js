// examples/cache-utilities.js
const { clearCache, getCachedDomains } = require('../dist/index.js');
const disposableEmailDetector = require('../dist/index.js');

async function cacheExample() {
  console.log('=== Cache Utilities Example ===\n');

  // Check initial cache state
  console.log('Initial cached domains:', getCachedDomains()?.length || 'None');

  // Load domains by making a detection call
  await disposableEmailDetector('test@example.com');
  console.log('After first call:', getCachedDomains()?.length || 'None', 'domains cached');

  // Clear cache
  clearCache();
  console.log('After clearing cache:', getCachedDomains()?.length || 'None');

  // Load again
  await disposableEmailDetector('test@gmail.com');
  console.log('After reload:', getCachedDomains()?.length || 'None', 'domains cached');
}

cacheExample().catch(console.error);