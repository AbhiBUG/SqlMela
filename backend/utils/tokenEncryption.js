```javascript
import crypto from "node:crypto";

const keyHex = process.env.GITHUB_TOKEN_ENCRYPTION_KEY || "";

if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
  throw new Error(
    "GITHUB_TOKEN_ENCRYPTION_KEY must be a 64-character hexadecimal key"
  );
}

const key = Buffer.from(keyHex, "hex");

export const encryptToken = (token) => {
  if (typeof token !== "string" || !token) {
    throw new Error("A valid token is required");
  }

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  // Format: IV:AUTH_TAG:CIPHERTEXT
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex")
  ].join(":");
};

export const decryptToken = (storedValue) => {
  if (typeof storedValue !== "string") {
    throw new Error("Invalid encrypted token");
  }

  const parts = storedValue.split(":");

  if (
    parts.length !== 3 ||
    !/^[0-9a-f]{24}$/i.test(parts[0]) ||
    !/^[0-9a-f]{32}$/i.test(parts[1]) ||
    !/^(?:[0-9a-f]{2})+$/i.test(parts[2])
  ) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  // Throws if the token or authentication tag was tampered with.
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};
```