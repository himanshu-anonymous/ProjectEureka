/**
 * WebAuthn Client Library for DGIPR Command Center Face Lock / Biometric Login.
 *
 * Privacy & Security Architecture:
 * - Operates strictly via W3C Web Authentication API (navigator.credentials).
 * - ZERO biometric templates, photos, or facial embeddings stored on server.
 * - Hardware Secure Enclave (Apple Secure Enclave, Windows Hello TPM, Android Keystore)
 *   performs biometric match locally on device.
 */

export function bufferToBase64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64urlToBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function isWebAuthnAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
}

export async function isPlatformBiometricsAvailable(): Promise<boolean> {
  if (!isWebAuthnAvailable()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/**
 * Register a new device Face ID / Windows Hello authenticator.
 */
export async function registerBiometricAuthenticator(
  username: string,
  displayName?: string,
  label: string = 'Device Face ID / Windows Hello'
): Promise<{ success: boolean; message: string; credentialId?: string }> {
  if (!isWebAuthnAvailable()) {
    throw new Error('WebAuthn biometrics is not supported in this browser environment.');
  }

  // 1. Fetch registration options from backend
  const optRes = await fetch('/api/v1/auth/webauthn/register-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, display_name: displayName || username }),
  });

  if (!optRes.ok) {
    const err = await optRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to initialize biometric registration options.');
  }

  const { options, challenge_token } = await optRes.json();

  // 2. Format options for browser credentials.create
  const creationOptions: PublicKeyCredentialCreationOptions = {
    rp: options.rp,
    user: {
      id: base64urlToBuffer(options.user.id) as unknown as BufferSource,
      name: options.user.name,
      displayName: options.user.displayName,
    },
    challenge: base64urlToBuffer(options.challenge) as unknown as BufferSource,
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout || 60000,
    attestation: options.attestation || 'none',
    authenticatorSelection: options.authenticatorSelection,
    excludeCredentials: (options.excludeCredentials || []).map((cred: any) => ({
      id: base64urlToBuffer(cred.id) as unknown as BufferSource,
      type: cred.type,
      transports: cred.transports,
    })),
  };

  // 3. Prompt device biometric sensor (Face ID / Windows Hello)
  const credential = (await navigator.credentials.create({
    publicKey: creationOptions,
  })) as PublicKeyCredential;

  if (!credential) {
    throw new Error('Biometric registration was cancelled.');
  }

  const rawAttestation = credential.response as AuthenticatorAttestationResponse;

  // 4. Serialize credential for backend verification
  const credentialPayload = {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(rawAttestation.clientDataJSON),
      attestationObject: bufferToBase64url(rawAttestation.attestationObject),
      transports: rawAttestation.getTransports ? rawAttestation.getTransports() : [],
    },
  };

  // 5. Send to backend for verification and public key persistence
  const verifyRes = await fetch('/api/v1/auth/webauthn/verify-registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credential: credentialPayload,
      challenge_token,
      label,
    }),
  });

  if (!verifyRes.ok) {
    const err = await verifyRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to verify biometric registration on server.');
  }

  const verifyData = await verifyRes.json();
  return {
    success: true,
    message: 'Face ID / Biometric authenticator successfully registered.',
    credentialId: verifyData.credential_id,
  };
}

/**
 * Authenticate using device Face ID / Windows Hello passkey.
 */
export async function authenticateBiometric(
  username: string = 'dg_admin'
): Promise<{ success: boolean; token: string; user: any; message?: string }> {
  if (!isWebAuthnAvailable()) {
    throw new Error('WebAuthn biometrics is not supported in this browser.');
  }

  // 1. Fetch assertion options
  const optRes = await fetch('/api/v1/auth/webauthn/login-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!optRes.ok) {
    const err = await optRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to get biometric login challenge.');
  }

  const { options, challenge_token, has_registered_credentials } = await optRes.json();

  // 2. Format options for browser credentials.get
  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: base64urlToBuffer(options.challenge) as unknown as BufferSource,
    timeout: options.timeout || 60000,
    rpId: options.rpId,
    userVerification: options.userVerification || 'preferred',
    allowCredentials: (options.allowCredentials || []).map((cred: any) => ({
      id: base64urlToBuffer(cred.id) as unknown as BufferSource,
      type: cred.type,
      transports: cred.transports,
    })),
  };

  // 3. Prompt device biometric sensor
  const assertion = (await navigator.credentials.get({
    publicKey: requestOptions,
  })) as PublicKeyCredential;

  if (!assertion) {
    throw new Error('Biometric authentication was cancelled.');
  }

  const rawAssertion = assertion.response as AuthenticatorAssertionResponse;

  // 4. Serialize assertion response
  const assertionPayload = {
    id: assertion.id,
    rawId: bufferToBase64url(assertion.rawId),
    type: assertion.type,
    response: {
      authenticatorData: bufferToBase64url(rawAssertion.authenticatorData),
      clientDataJSON: bufferToBase64url(rawAssertion.clientDataJSON),
      signature: bufferToBase64url(rawAssertion.signature),
      userHandle: rawAssertion.userHandle ? bufferToBase64url(rawAssertion.userHandle) : null,
    },
  };

  // 5. Verify assertion with backend
  const verifyRes = await fetch('/api/v1/auth/webauthn/verify-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credential: assertionPayload,
      challenge_token,
      username,
    }),
  });

  if (!verifyRes.ok) {
    const err = await verifyRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Biometric authentication rejected.');
  }

  const result = await verifyRes.json();
  return {
    success: true,
    token: result.access_token,
    user: result.user,
    message: result.message,
  };
}

/**
 * List registered biometric credentials for an officer.
 */
export async function listBiometricCredentials(username: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/v1/auth/webauthn/credentials?username=${encodeURIComponent(username)}`);
    if (res.ok) {
      const data = await res.json();
      return data.credentials || [];
    }
  } catch {}
  return [];
}

/**
 * Deregister a biometric authenticator.
 */
export async function deleteBiometricCredential(credentialId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/auth/webauthn/credentials/${encodeURIComponent(credentialId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}
