# Nodispose

[![npm version](https://badge.fury.io/js/nodispose.svg)](https://badge.fury.io/js/nodispose)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/nodispose.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A fast and reliable disposable email address detector for Node.js applications. Protect your application from temporary and disposable email addresses with comprehensive domain detection and flexible configuration options.

## ✨ Features

- 🚀 **Fast & Efficient** - Optimized performance with intelligent caching
- 🔒 **Reliable Detection** - Comprehensive database of disposable email domains
- 📦 **Zero Dependencies** - Lightweight with no external runtime dependencies
- 🔧 **TypeScript Support** - Full TypeScript definitions included
- 🌐 **Dual Module Support** - Works with both CommonJS and ES modules
- ⚡ **Race Condition Safe** - Handles concurrent requests gracefully
- 🛡️ **Error Handling** - Robust error handling with custom error types
- 🎯 **Flexible API** - Multiple detection methods for different use cases

## 📦 Installation

```bash
npm install nodispose
```

```bash
yarn add nodispose
```

```bash
pnpm add nodispose
```

## 🚀 Quick Start

### Basic Usage

```javascript
const disposableEmailDetector = require('nodispose');

async function checkEmail() {
  // Detailed result with context
  const result = await disposableEmailDetector('test@10minutemail.com');
  console.log(result);
  // Output: { isDisposable: true, domain: '10minutemail.com' }

  // Simple boolean check
  const { isDisposableEmail } = require('nodispose');
  const isDisposable = await isDisposableEmail('user@gmail.com');
  console.log(isDisposable); // false
}

checkEmail();
```

### ES Modules

```javascript
import disposableEmailDetector, { isDisposableEmail } from 'nodispose';

const result = await disposableEmailDetector('temp@tempmail.org');
console.log(result.isDisposable); // true

const isDisposable = await isDisposableEmail('user@example.com');
console.log(isDisposable); // false (assuming example.com is not disposable)
```

### TypeScript

```typescript
import disposableEmailDetector, { 
  DetectionResult, 
  isDisposableEmail,
  InvalidEmailError 
} from 'nodispose';

async function validateEmail(email: string): Promise<DetectionResult> {
  try {
    const result = await disposableEmailDetector(email);
    return result;
  } catch (error) {
    if (error instanceof InvalidEmailError) {
      console.error('Invalid email format:', error.message);
    }
    throw error;
  }
}
```

## 📚 API Reference

### `disposableEmailDetector(email: string): Promise<DetectionResult>`

Main detection function that returns detailed information about the email domain.

**Parameters:**
- `email` (string): The email address to check

**Returns:** `Promise<DetectionResult>`

```typescript
interface DetectionResult {
  isDisposable: boolean;  // Whether the domain is disposable
  domain: string;         // The extracted domain
  error?: string;         // Error message if detection failed
}
```

**Example:**
```javascript
const result = await disposableEmailDetector('user@tempmail.org');
console.log(result);
// { isDisposable: true, domain: 'tempmail.org' }
```

### `isDisposableEmail(email: string): Promise<boolean>`

Simplified function that returns only a boolean result.

**Parameters:**
- `email` (string): The email address to check

**Returns:** `Promise<boolean>`

**Example:**
```javascript
const isDisposable = await isDisposableEmail('test@10minutemail.com');
console.log(isDisposable); // true
```

### Utility Functions

#### `clearCache(): void`

Clears the internal domain cache. Useful for testing or forcing a refresh of domain data.

```javascript
import { clearCache } from 'nodispose';

clearCache(); // Forces reload of domain data on next detection
```

#### `getCachedDomains(): string[] | undefined`

Returns a copy of the currently cached domains for debugging purposes.

```javascript
import { getCachedDomains } from 'nodispose';

const domains = getCachedDomains();
console.log(domains?.length); // Number of cached domains
```

## 🔧 Configuration

The library uses a local JSON file containing disposable email domains. The domains are loaded automatically and cached for optimal performance.

### Domain Data Location

The library looks for domain data in the following location:
- `data/domains.json` (relative to the package installation)

### Custom Domain Lists

You can extend or modify the domain detection by updating the `domains.json` file in the package's data directory. The file should contain a JSON array of domain strings:

```json
[
  "10minutemail.com",
  "tempmail.org",
  "guerrillamail.com",
  "mailinator.com"
]
```

## 🛠️ Error Handling

The library provides custom error types for better error handling:

### `InvalidEmailError`

Thrown when an email address has an invalid format.

```javascript
import { InvalidEmailError } from 'nodispose';

try {
  await disposableEmailDetector('invalid-email');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    console.error('Invalid email format:', error.message);
  }
}
```

### Error Scenarios

The library handles various error scenarios gracefully:

- **Invalid email format**: Returns error in result object
- **Missing domain data**: Throws appropriate error
- **File system errors**: Propagates with context
- **JSON parsing errors**: Provides clear error messages

## 📋 Examples

### Basic Email Validation

```javascript
const disposableEmailDetector = require('nodispose');

async function validateUserEmail(email) {
  const result = await disposableEmailDetector(email);
  
  if (result.error) {
    return { valid: false, reason: result.error };
  }
  
  if (result.isDisposable) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' };
  }
  
  return { valid: true, domain: result.domain };
}

// Usage
validateUserEmail('user@10minutemail.com')
  .then(result => console.log(result));
// { valid: false, reason: 'Disposable email addresses are not allowed' }
```

### Batch Processing

```javascript
const { isDisposableEmail } = require('nodispose');

async function filterDisposableEmails(emails) {
  const results = await Promise.all(
    emails.map(async (email) => ({
      email,
      isDisposable: await isDisposableEmail(email)
    }))
  );
  
  return {
    legitimate: results.filter(r => !r.isDisposable).map(r => r.email),
    disposable: results.filter(r => r.isDisposable).map(r => r.email)
  };
}

// Usage
const emails = [
  'user@gmail.com',
  'test@10minutemail.com',
  'admin@company.com',
  'temp@tempmail.org'
];

filterDisposableEmails(emails)
  .then(result => console.log(result));
```

### Express.js Middleware

```javascript
const disposableEmailDetector = require('nodispose');

function validateEmailMiddleware(req, res, next) {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  disposableEmailDetector(email)
    .then(result => {
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      
      if (result.isDisposable) {
        return res.status(400).json({ 
          error: 'Disposable email addresses are not allowed' 
        });
      }
      
      req.validatedEmail = {
        email: email,
        domain: result.domain
      };
      next();
    })
    .catch(error => {
      res.status(500).json({ error: 'Email validation failed' });
    });
}

// Usage in Express route
app.post('/register', validateEmailMiddleware, (req, res) => {
  // Email is validated and available in req.validatedEmail
  res.json({ message: 'Email is valid', email: req.validatedEmail });
});
```

### Form Validation

```javascript
const { isDisposableEmail } = require('nodispose');

class EmailValidator {
  static async validate(email) {
    const errors = [];
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
      return { valid: false, errors };
    }
    
    // Disposable email check
    try {
      const isDisposable = await isDisposableEmail(email);
      if (isDisposable) {
        errors.push('Disposable email addresses are not allowed');
      }
    } catch (error) {
      errors.push('Unable to validate email domain');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Usage
EmailValidator.validate('user@tempmail.org')
  .then(result => {
    if (!result.valid) {
      console.log('Validation errors:', result.errors);
    }
  });
```

## 🧪 Testing

The library includes comprehensive tests. To run them:

```bash
npm test
```

For coverage report:

```bash
npm run test:coverage
```

For watch mode during development:

```bash
npm run test:watch
```

## 🏗️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/aoamusat/nodispose.git
cd nodispose

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Project Structure

```
nodispose/
├── src/
│   └── index.ts          # Main source file
├── dist/                 # Built files (generated)
├── data/
│   └── domains.json      # Disposable domain list
├── examples/             # Usage examples
├── __tests__/            # Test files
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

- `npm run build` - Build all formats (CommonJS, ES modules, TypeScript declarations)
- `npm run dev` - Run in development mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Domains

To add new disposable email domains:

1. Update `data/domains.json` with the new domains
2. Ensure domains are in lowercase
3. Add tests for the new domains
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help maintain the disposable domain list
- Inspired by the need for better email validation in modern web applications
- Built with TypeScript and modern Node.js best practices

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/aoamusat/nodispose/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/aoamusat/nodispose/issues)
- 📧 **Email**: hello@a4m.dev

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/nodispose)
- [GitHub Repository](https://github.com/aoamusat/nodispose)
- [Changelog](CHANGELOG.md)
- [Contributing Guide](CONTRIBUTING.md)

---

Made with ❤️ by [Akeem Amusat](https://github.com/aoamusat)
