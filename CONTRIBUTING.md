# Contributing to Nodispose

Thank you for your interest in contributing to nodispose! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a professional tone in all interactions

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/nodispose.git
cd nodispose
```

3. Add the upstream repository:
```bash
git remote add upstream https://github.com/aoamusat/nodispose.git
```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Available Scripts

```bash
# Development
npm run dev          # Run with tsx for development
npm run build        # Build all targets (CJS, ESM, types)
npm run clean        # Clean build directory

# Testing
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier

# Examples
npm run example      # Run example usage
```

### Project Structure

```
nodispose/
├── src/
│   └── index.ts          # Main source file
├── __tests__/
│   └── index.test.ts     # Test suite
├── examples/
│   └── basic-usage.js    # Usage examples
├── docs/                 # Documentation
├── scripts/
│   └── fix-esm.js       # Build script for ESM
├── data/                 # Optional local domain list
└── dist/                # Built files (generated)
```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-new-validation`
- `fix/memory-leak-issue`
- `docs/update-api-reference`
- `refactor/improve-error-handling`

### Coding Standards

#### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide comprehensive type definitions
- Avoid `any` types when possible
- Use meaningful variable and function names

#### Code Style

- Follow the existing code style
- Use Prettier for formatting (runs automatically)
- Follow ESLint rules (configured in package.json)
- Write self-documenting code with clear comments

#### Example Code Style

```typescript
/**
 * Validates email format and extracts domain
 * @param email - The email address to validate
 * @returns The extracted domain in lowercase
 * @throws InvalidEmailError if email format is invalid
 */
const extractDomain = (email: string): string => {
  if (typeof email !== 'string' || !email.trim()) {
    throw new InvalidEmailError('Email must be a non-empty string');
  }
  
  // Implementation...
};
```

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(api): add support for custom timeout configuration
fix(validation): handle edge case with empty domain
docs(readme): update installation instructions
test(core): add tests for error handling scenarios
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

- Write tests for all new functionality
- Maintain or improve test coverage
- Use descriptive test names
- Test both success and error cases

#### Test Structure

```typescript
describe('disposableEmailDetector', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('when validating email format', () => {
    it('should reject emails without @ symbol', async () => {
      const result = await disposableEmailDetector('invalid-email');
      expect(result.error).toBeDefined();
      expect(result.isDisposable).toBe(false);
    });

    it('should extract domain correctly', async () => {
      const result = await disposableEmailDetector('user@example.com');
      expect(result.domain).toBe('example.com');
    });
  });
});
```

### Test Categories

1. **Unit Tests**: Test individual functions and methods
2. **Integration Tests**: Test component interactions
3. **Error Handling Tests**: Test error scenarios
4. **Performance Tests**: Test caching and race conditions

## Submitting Changes

### Before Submitting

1. Ensure all tests pass:
```bash
npm test
```

2. Run linting:
```bash
npm run lint
```

3. Build the project:
```bash
npm run build
```

4. Update documentation if needed

### Pull Request Process

1. **Update your fork:**
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

2. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes and commit:**
```bash
git add .
git commit -m "feat: add your feature description"
```

4. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request:**
   - Go to GitHub and create a PR from your branch
   - Fill out the PR template completely
   - Link any related issues

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

## Types of Contributions

### Bug Reports

When reporting bugs:
- Use the issue template
- Provide minimal reproduction case
- Include environment details
- Attach relevant error messages

### Feature Requests

When requesting features:
- Explain the use case
- Provide examples of desired API
- Consider backward compatibility
- Discuss implementation approach

### Documentation

Documentation improvements are always welcome:
- Fix typos and grammar
- Add examples and use cases
- Improve API documentation
- Update troubleshooting guides

### Code Contributions

Areas where contributions are especially welcome:
- Performance improvements
- Additional validation features
- Better error messages
- Enhanced TypeScript types
- Test coverage improvements

## Release Process

### Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in package.json
2. Update CHANGELOG.md
3. Run full test suite
4. Build and verify all targets
5. Create git tag
6. Publish to npm
7. Create GitHub release

## Development Tips

### Local Testing

Test your changes with real projects:

```bash
# In your nodispose directory
npm run build
npm pack

# In a test project
npm install /path/to/nodispose-1.0.0.tgz
```

### Debugging

Add debug logging during development:

```typescript
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Debug info:', { email, domain, result });
}
```

### Performance Testing

Test performance with large domain lists:

```bash
# Create large test file
node -e "
const domains = Array.from({length: 10000}, (_, i) => \`test\${i}.com\`);
require('fs').writeFileSync('large-domains.json', JSON.stringify(domains));
"
```

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create a GitHub Issue
- **Security**: Email maintainers directly
- **Chat**: Join project discussions

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to nodispose! 🎉
