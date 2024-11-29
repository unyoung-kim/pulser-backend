import crypto from "crypto";

export const encrypt = (text: string): string => {
  const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY; // 32-byte hex key from env
  if (!TOKEN_ENCRYPTION_KEY) {
    throw new Error("Encryption key missing in env variables");
  }

  // Convert the key from hex to a Buffer
  const key = Buffer.from(TOKEN_ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(16); // Generate a new IV for every encryption
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV + encrypted text (IV is needed for decryption)
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText: string): string => {
  const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY; // 32-byte hex key from env
  if (!TOKEN_ENCRYPTION_KEY) {
    throw new Error("Encryption key missing in env variables");
  }
  // Convert the key from hex to a Buffer
  const key = Buffer.from(TOKEN_ENCRYPTION_KEY, "hex");
  const [ivHex, encryptedData] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
