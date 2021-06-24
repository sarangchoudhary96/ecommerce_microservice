import crypto from "crypto";
import { config } from "../../config";
const { algorithm } = config.passwordEncryption;

export const encrypt = ({ password, secret }) => {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
  let encrypted = cipher.update(password);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = ({ password, secret }) => {
  let parts = password.split(":");
  let iv = Buffer.from(parts.shift(), "hex");
  let encryptedText = Buffer.from(parts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
