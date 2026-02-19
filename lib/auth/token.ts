export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function createToken(
  payload: Omit<TokenPayload, "exp">,
  secret: string
): Promise<string> {
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  };
  const payloadB64 = base64urlEncode(JSON.stringify(fullPayload));
  const signature = await sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<TokenPayload | null> {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const payloadB64 = token.substring(0, dotIndex);
  const signatureB64 = token.substring(dotIndex + 1);

  const expectedSignature = await sign(payloadB64, secret);
  if (expectedSignature !== signatureB64) return null;

  try {
    const payload: TokenPayload = JSON.parse(base64urlDecode(payloadB64));
    if (!payload.sub || !payload.email || !payload.role || !payload.exp)
      return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return base64urlEncodeBytes(new Uint8Array(signature));
}

function base64urlEncode(input: string): string {
  return base64urlEncodeBytes(new TextEncoder().encode(input));
}

function base64urlEncodeBytes(bytes: Uint8Array): string {
  const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join("");
  return btoa(binString).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binString = atob(padded);
  const bytes = Uint8Array.from(binString, (c) => c.codePointAt(0)!);
  return new TextDecoder().decode(bytes);
}
