import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isSafeUrl, sanitizeUrl } from '../src/lib/urlSecurity.ts';

describe('URL Security & Malicious Scheme Rejection Suite', () => {
  it('should accept valid https and http URLs', () => {
    assert.equal(isSafeUrl('https://maharashtra.gov.in'), true);
    assert.equal(isSafeUrl('http://dgipr.maharashtra.gov.in/press-releases'), true);
    assert.equal(isSafeUrl('https://twitter.com/MahaDGIPR/status/12345'), true);
    assert.equal(isSafeUrl('https://youtube.com/watch?v=abcd123'), true);
    assert.equal(isSafeUrl('https://sub.domain.org/path?q=1&b=2#anchor'), true);
  });

  it('should accept safe internal relative application routes', () => {
    assert.equal(isSafeUrl('/sources/clipping/CLIP-MH-12-1'), true);
    assert.equal(isSafeUrl('/sources/social/SOC-MH-01-2'), true);
    assert.equal(isSafeUrl('/sources/tv/TV-MH-20-1'), true);
    assert.equal(isSafeUrl('/dashboard'), true);
    assert.equal(isSafeUrl('/districts/pune'), true);
  });

  it('should strictly reject malicious javascript: and data: schemes', () => {
    assert.equal(isSafeUrl("javascript:alert('XSS')"), false);
    assert.equal(isSafeUrl('javascript:void(0)'), false);
    assert.equal(isSafeUrl('JAVASCRIPT:alert(1)'), false);
    assert.equal(isSafeUrl(' javascript:alert(document.cookie)'), false);
    assert.equal(isSafeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), false);
    assert.equal(isSafeUrl('data:image/svg+xml,<svg onload=alert(1)>'), false);
    assert.equal(isSafeUrl('vbscript:msgbox(1)'), false);
    assert.equal(isSafeUrl('file:///C:/Windows/System32/calc.exe'), false);
    assert.equal(isSafeUrl('file:///etc/passwd'), false);
    assert.equal(isSafeUrl('blob:https://sample.com/1234-uuid'), false);
  });

  it('should strictly reject protocol-relative and backslash evasion URLs', () => {
    assert.equal(isSafeUrl('//evil.com/phishing'), false);
    assert.equal(isSafeUrl('/\\evil.com'), false);
    assert.equal(isSafeUrl('\\evil.com'), false);
    assert.equal(isSafeUrl('ftp://files.example.com'), false);
  });

  it('should reject empty, null, undefined, and non-string inputs safely without throwing', () => {
    assert.equal(isSafeUrl(null), false);
    assert.equal(isSafeUrl(undefined), false);
    assert.equal(isSafeUrl(''), false);
    assert.equal(isSafeUrl('   '), false);
    assert.equal(isSafeUrl(123), false);
    assert.equal(isSafeUrl({}), false);
  });

  it('should sanitize safe URLs and return null for malicious ones', () => {
    assert.equal(sanitizeUrl('  https://gov.in/doc  '), 'https://gov.in/doc');
    assert.equal(sanitizeUrl('/sources/tv/1'), '/sources/tv/1');
    assert.equal(sanitizeUrl('javascript:malicious()'), null);
    assert.equal(sanitizeUrl('data:text/plain,hello'), null);
  });
});
