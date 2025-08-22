# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation suite
- API reference documentation
- Usage examples and integration guides
- Troubleshooting guide
- Contributing guidelines

## [1.0.0] - 2025-08-21

### Added
- Initial release of nodispose
- Core disposable email detection functionality
- Support for local domain lists via JSON files
- Support for remote domain lists from GitHub and custom URLs
- Dual module support (CommonJS and ES modules)
- Full TypeScript support with comprehensive type definitions
- Race condition protection for concurrent requests
- Caching system for improved performance
- Custom error classes (`InvalidEmailError`, `ExternalSourceError`)
- Utility functions (`clearCache`, `getCachedDomains`)
- Configurable timeouts for external requests
- Comprehensive test suite with Jest
- Example usage files
- ESLint and Prettier configuration
- Multiple build targets (CJS, ESM, TypeScript declarations)

### Features
- `disposableEmailDetector()` - Main detection function with detailed results
- `isDisposableEmail()` - Simplified boolean-only detection function
- Flexible configuration options for data sources
- Automatic fallback between multiple local file locations
- Proper error handling with graceful degradation
- Memory-efficient caching system
- User-Agent header for external requests
- JSON validation for domain data

### Technical Details
- Node.js 16.0.0+ compatibility
- Zero runtime dependencies
- TypeScript 5.0+ support
- Jest testing framework
- Multi-format builds (CommonJS, ES modules, TypeScript declarations)
- Comprehensive error handling and validation
- Performance optimizations with caching and race condition protection

[Unreleased]: https://github.com/aoamusat/nodispose/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/aoamusat/nodispose/releases/tag/v1.0.0
