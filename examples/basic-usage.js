// examples/basic-usage.js
const disposableEmailDetector = require('../dist/index.js');

async function basicExample() {
  console.log('=== Basic Usage Examples ===\n');

  // Test disposable email
  const result1 = await disposableEmailDetector('test@10minutemail.com');
  console.log('Disposable email:', result1);

  // Test legitimate email
  const result2 = await disposableEmailDetector('user@gmail.com');
  console.log('Legitimate email:', result2);

  // Test invalid email
  const result3 = await disposableEmailDetector('invalid-email');
  console.log('Invalid email:', result3);
}

basicExample().catch(console.error);