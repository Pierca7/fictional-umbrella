import crypto from "crypto";

const algorithm = "aes-192-cbc";

export const encrypt = (str: string) => {
  const password = process.env.API_SECRET;
  const salt = process.env.API_SALT;
  const key = crypto.scryptSync(password, salt, 24);
  const iv = Buffer.alloc(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedId = cipher.update(str, "utf8", "hex");
  encryptedId += cipher.final("hex");

  return encryptedId;
};

export const decrypt = (str: string) => {
  const password = process.env.API_SECRET;
  const salt = process.env.API_SALT;
  const key = crypto.scryptSync(password, salt, 24);
  const iv = Buffer.alloc(16);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(str, "hex", "utf8");
  decrypted += decipher.final();

  return decrypted;
};

export const generateHash = () => crypto.randomBytes(20).toString("hex");
