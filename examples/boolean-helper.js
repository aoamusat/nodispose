// examples/boolean-helper.js
const { isDisposableEmail } = require('../dist/index.js');

async function booleanExample() {
  console.log('=== Boolean Helper Examples ===\n');

  const emails = [
    'user@gmail.com',
    'test@10minutemail.com',
    'person@tempmail.org',
    'admin@company.com'
  ];

  for (const email of emails) {
    const isDisposable = await isDisposableEmail(email);
    console.log(`${email}: ${isDisposable ? 'Disposable' : 'Legitimate'}`);
  }
}

booleanExample().catch(console.error);