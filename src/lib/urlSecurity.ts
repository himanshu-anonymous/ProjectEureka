/**
 * URL Security and Validation Utility.
 * Ensures strictly that only http: or https: (or safe internal relative paths)
 * are rendered as clickable navigation links.
 * Explicitly rejects javascript:, data:, vbscript:, file:, blob:, etc.
 */

export function isSafeUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  // Disallow scheme-relative URLs (e.g. //malicious.com) and backslash traversal
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return false;
  }

  // Safe internal relative path
  if (trimmed.startsWith('/')) {
    return true;
  }

  // Reject raw control characters or encoded javascript:
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('blob:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeUrl(rawUrl: string | null | undefined): string | null {
  if (!isSafeUrl(rawUrl)) return null;
  return rawUrl!.trim();
}
