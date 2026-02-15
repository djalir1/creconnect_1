import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_dev_secret";
const EXPIRES_IN = "7d";

interface TokenPayload {
  userId: string;
  role: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
