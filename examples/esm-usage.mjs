// examples/esm-usage.mjs
import disposableEmailDetector, { isDisposableEmail } from '../dist/index.mjs';

async function esmExample() {
  console.log('=== ES Module Usage Example ===\n');

  // Detailed result
  const result = await disposableEmailDetector('user@gmail.com');
  console.log('Detailed result:', result);

  // Simple boolean check
  const isDisposable = await isDisposableEmail('test@tempmail.org');
  console.log('Boolean result:', isDisposable);
}

esmExample().catch(console.error);