import crypto from "crypto";
import bcrypt from "bcrypt";

export const generateAccessKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "DEF-";
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export const hashKeyWithSalt = (key) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(key + salt)
    .digest("hex");
  return `${salt}:${hash}`;
};

export const verifyKey = (key, storedHash) => {
  const [salt, hash] = storedHash.split(":");
  const computedHash = crypto
    .createHash("sha256")
    .update(key + salt)
    .digest("hex");
  return hash === computedHash;
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
