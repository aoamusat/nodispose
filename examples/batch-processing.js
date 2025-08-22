// examples/batch-processing.js
const disposableEmailDetector = require('../dist/index.js');

async function batchExample() {
  console.log('=== Batch Processing Example ===\n');

  const emails = [
    'user@gmail.com',
    'test@10minutemail.com',
    'person@tempmail.org',
    'admin@yahoo.com',
    'spam@guerrillamail.com'
  ];

  const results = await Promise.all(
    emails.map(email => disposableEmailDetector(email))
  );

  results.forEach((result, index) => {
    const status = result.isDisposable ? 'DISPOSABLE' : 'LEGITIMATE';
    const error = result.error ? ` (Error: ${result.error})` : '';
    console.log(`${emails[index]}: ${status}${error}`);
  });
}

batchExample().catch(console.error);