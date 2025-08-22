// examples/error-handling.js
const disposableEmailDetector = require('../dist/index.js');
const { InvalidEmailError } = require('../dist/index.js');

async function errorHandlingExample() {
  console.log('=== Error Handling Examples ===\n');

  const invalidEmails = [
    '',
    'invalid-email',
    'no-at-sign',
    '@domain.com',
    'user@',
    'user@@domain.com'
  ];

  for (const email of invalidEmails) {
    const result = await disposableEmailDetector(email);
    if (result.error) {
      console.log(`"${email}": ${result.error}`);
    } else {
      console.log(`"${email}": Valid - ${result.isDisposable ? 'Disposable' : 'Legitimate'}`);
    }
  }
}

errorHandlingExample().catch(console.error);