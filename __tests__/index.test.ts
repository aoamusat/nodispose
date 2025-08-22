// @ts-nocheck
import disposableEmailDetector, {
  isDisposableEmail,
  clearCache,
  getCachedDomains,
  InvalidEmailError,
  DetectionResult
} from '../src/index';

describe('nodisposable', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('disposableEmailDetector', () => {
    it('should detect disposable email domains', async () => {
      const result = await disposableEmailDetector('test@10minutemail.com');
      expect(result.isDisposable).toBe(true);
      expect(result.domain).toBe('10minutemail.com');
      expect(result.error).toBeUndefined();
    });

    it('should detect legitimate email domains', async () => {
      const result = await disposableEmailDetector('user@gmail.com');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('gmail.com');
      expect(result.error).toBeUndefined();
    });

    it('should handle case insensitive domains', async () => {
      const result = await disposableEmailDetector('test@MAILINATOR.COM');
      expect(result.isDisposable).toBe(true);
      expect(result.domain).toBe('mailinator.com');
    });

    it('should handle emails with whitespace', async () => {
      const result = await disposableEmailDetector('  test@10minutemail.com  ');
      expect(result.isDisposable).toBe(true);
      expect(result.domain).toBe('10minutemail.com');
    });

    it('should return error for invalid email format', async () => {
      const result = await disposableEmailDetector('invalid-email');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('');
      expect(result.error).toBeDefined();
    });

    it('should return error for empty email', async () => {
      const result = await disposableEmailDetector('');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('');
      expect(result.error).toBeDefined();
    });

    it('should return error for email without @', async () => {
      const result = await disposableEmailDetector('testgmail.com');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('');
      expect(result.error).toBeDefined();
    });

    it('should return error for email with multiple @', async () => {
      const result = await disposableEmailDetector('test@@gmail.com');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('');
      expect(result.error).toBeDefined();
    });

    it('should return error for email without local part', async () => {
      const result = await disposableEmailDetector('@gmail.com');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('');
      expect(result.error).toBeDefined();
    });

    it('should return error for email without domain', async () => {
      const result = await disposableEmailDetector('test@');
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('');
      expect(result.error).toBeDefined();
    });
  });

  describe('isDisposableEmail', () => {
    it('should return true for disposable emails', async () => {
      const result = await isDisposableEmail('test@guerrillamail.com');
      expect(result).toBe(true);
    });

    it('should return false for legitimate emails', async () => {
      const result = await isDisposableEmail('user@outlook.com');
      expect(result).toBe(false);
    });

    it('should return false for invalid emails', async () => {
      const result = await isDisposableEmail('invalid-email');
      expect(result).toBe(false);
    });
  });

  describe('InvalidEmailError', () => {
    it('should create error with default message', () => {
      const error = new InvalidEmailError();
      expect(error.message).toBe('Invalid email format');
      expect(error.name).toBe('InvalidEmailError');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof InvalidEmailError).toBe(true);
    });

    it('should create error with custom message', () => {
      const error = new InvalidEmailError('Custom error message');
      expect(error.message).toBe('Custom error message');
      expect(error.name).toBe('InvalidEmailError');
    });
  });

  describe('cache functionality', () => {
    it('should cache domains after first load', async () => {
      expect(getCachedDomains()).toBeUndefined();
      
      await disposableEmailDetector('test@10minutemail.com');
      
      const cachedDomains = getCachedDomains();
      expect(cachedDomains).toBeDefined();
      expect(Array.isArray(cachedDomains)).toBe(true);
      if (cachedDomains) {
        expect(cachedDomains.length).toBeGreaterThan(0);
        expect(cachedDomains.includes('10minutemail.com')).toBe(true);
      }
    });

    it('should clear cache', async () => {
      await disposableEmailDetector('test@10minutemail.com');
      expect(getCachedDomains()).toBeDefined();
      
      clearCache();
      expect(getCachedDomains()).toBeUndefined();
    });

    it('should return copy of cached domains', async () => {
      await disposableEmailDetector('test@10minutemail.com');
      
      const cachedDomains1 = getCachedDomains();
      const cachedDomains2 = getCachedDomains();
      
      expect(cachedDomains1).not.toBe(cachedDomains2); // Different objects
      expect(cachedDomains1).toEqual(cachedDomains2); // Same content
    });
  });

  describe('edge cases', () => {
    it('should handle non-string input gracefully', async () => {
      // @ts-ignore - Testing invalid input
      const result = await disposableEmailDetector(null);
      expect(result.isDisposable).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle undefined input gracefully', async () => {
      // @ts-ignore - Testing invalid input
      const result = await disposableEmailDetector(undefined);
      expect(result.isDisposable).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle domain with spaces', async () => {
      const result = await disposableEmailDetector('test@domain with spaces.com');
      expect(result.isDisposable).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle very long email', async () => {
      const longEmail = 'a'.repeat(1000) + '@gmail.com';
      const result = await disposableEmailDetector(longEmail);
      expect(result.isDisposable).toBe(false);
      expect(result.domain).toBe('gmail.com');
    });
  });

  describe('concurrent requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const detectionPromises = [
        disposableEmailDetector('test1@10minutemail.com'),
        disposableEmailDetector('test2@gmail.com'),
        disposableEmailDetector('test3@mailinator.com')
      ];
      
      const booleanPromises = [
        isDisposableEmail('test4@yahoo.com'),
        isDisposableEmail('test5@mailinator.com')
      ];

      const [detectionResults, booleanResults] = await Promise.all([
        Promise.all(detectionPromises),
        Promise.all(booleanPromises)
      ]);
      
      expect(detectionResults[0].isDisposable).toBe(true);
      expect(detectionResults[1].isDisposable).toBe(false);
      expect(detectionResults[2].isDisposable).toBe(true);
      expect(booleanResults[0]).toBe(false);
      expect(booleanResults[1]).toBe(true);
    });
  });

  describe('known disposable domains', () => {
    const knownDisposableDomains = [
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      '1secmail.com'
    ];

    knownDisposableDomains.forEach(domain => {
      it(`should detect ${domain} as disposable`, async () => {
        const result = await disposableEmailDetector(`test@${domain}`);
        expect(result.isDisposable).toBe(true);
        expect(result.domain).toBe(domain);
      });
    });
  });

  describe('known legitimate domains', () => {
    const knownLegitDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com'
    ];

    knownLegitDomains.forEach(domain => {
      it(`should detect ${domain} as legitimate`, async () => {
        const result = await disposableEmailDetector(`test@${domain}`);
        expect(result.isDisposable).toBe(false);
        expect(result.domain).toBe(domain);
      });
    });
  });

  describe('type definitions', () => {
    it('should have correct DetectionResult type', async () => {
      const result: DetectionResult = await disposableEmailDetector('test@gmail.com');
      expect(typeof result.isDisposable).toBe('boolean');
      expect(typeof result.domain).toBe('string');
      expect(result.error === undefined || typeof result.error === 'string').toBe(true);
    });
  });
});