import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (payload) => {
  console.log("--- SEGREDO USADO PARA CRIAR O TOKEN ---");
  console.log(`"${secret}"`);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
