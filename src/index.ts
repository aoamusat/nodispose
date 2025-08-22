// src/index.ts
import fs from 'fs/promises';
import path from 'path';

// Directory resolution for both CommonJS and ES modules
let currentDir: string;
try {
  // Try CommonJS first
  currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
} catch {
  currentDir = process.cwd();
}

// Cache for domains and loading promises
let cachedDomains: string[] | undefined = undefined;
let loadingPromise: Promise<string[]> | null = null;

// Default configuration
const DEFAULT_CONFIG = {
  localFile: 'domains.json',
} as const;

/**
 * Custom error for invalid email format
 */
export class InvalidEmailError extends Error {
  constructor(message: string = 'Invalid email format') {
    super(message);
    this.name = 'InvalidEmailError';
    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }
}

/**
 * Validates email format and extracts domain
 */
const extractDomain = (email: string): string => {
  if (typeof email !== 'string' || !email.trim()) {
    throw new InvalidEmailError('Email must be a non-empty string');
  }

  const emailParts = email.trim().split('@');
  if (emailParts.length !== 2 || !emailParts[0] || !emailParts[1]) {
    throw new InvalidEmailError('Email must contain exactly one @ symbol with content before and after');
  }

  const domain = emailParts[1].toLowerCase().trim();
  if (!domain || domain.includes(' ')) {
    throw new InvalidEmailError('Invalid domain format');
  }

  return domain;
};

/**
 * Validates that the loaded data is an array of strings
 */
const validateDomainsArray = (data: unknown): string[] => {
  if (!Array.isArray(data)) {
    throw new Error('Domains data must be an array');
  }

  if (!data.every(item => typeof item === 'string')) {
    throw new Error('All domain entries must be strings');
  }

  return data;
};

/**
 * Loads domains from local file with race condition protection
 */
const loadDomains = async (): Promise<string[]> => {
  if (cachedDomains) return cachedDomains;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async (): Promise<string[]> => {
    try {
      // Load domains from data directory
      const filePath = path.join(currentDir, '..', 'data', DEFAULT_CONFIG.localFile);

      const fileBuffer = await fs.readFile(filePath);

      const rawData = JSON.parse(fileBuffer.toString());
      const domains = validateDomainsArray(rawData);
      
      cachedDomains = domains;
      return domains;
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON format in '${DEFAULT_CONFIG.localFile}'`);
      }
      throw error;
    }
  })();

  try {
    const result = await loadingPromise;
    return result;
  } finally {
    loadingPromise = null;
  }
};



/**
 * Result object with additional context
 */
export interface DetectionResult {
  /** Whether the email domain is disposable */
  isDisposable: boolean;
  /** The extracted domain */
  domain: string;
  /** Error details if detection failed */
  error?: string;
}

/**
 * Detects if an email address uses a disposable domain
 * @param email The email address to check
 * @param options Configuration options
 * @returns Promise that resolves to detection result
 */
export default async function disposableEmailDetector(email: string): Promise<DetectionResult> {
  try {
    const domain = extractDomain(email);
    const disposableDomains = await loadDomains();
    const isDisposable = disposableDomains.includes(domain);
    
    return {
      isDisposable,
      domain
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      isDisposable: false,
      domain: '',
      error: errorMessage
    };
  }
}

/**
 * Simplified version that returns only boolean (maintains backward compatibility)
 * @param email The email address to check
 * @returns Promise that resolves to true if disposable, false otherwise
 */
export async function isDisposableEmail(email: string): Promise<boolean> {
  const result = await disposableEmailDetector(email);
  return result.isDisposable;
}

/**
 * Clears the cached domains (useful for testing or forcing refresh)
 */
export function clearCache(): void {
  cachedDomains = undefined;
  loadingPromise = null;
}

/**
 * Gets the current cached domains (useful for debugging)
 */
export function getCachedDomains(): string[] | undefined {
  return cachedDomains ? [...cachedDomains] : undefined;
}

// Named exports for convenience
export { disposableEmailDetector };

// For CommonJS compatibility
module.exports = disposableEmailDetector;
module.exports.default = disposableEmailDetector;
module.exports.isDisposableEmail = isDisposableEmail;
module.exports.clearCache = clearCache;
module.exports.getCachedDomains = getCachedDomains;

module.exports.InvalidEmailError = InvalidEmailError;