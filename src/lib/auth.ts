import { NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

// Generate JWT Token
export const generateToken = (user: any) => {
  return jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, SECRET_KEY, {
    expiresIn: "1h", // 1 hour token expiration time
  });
};

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return null;
  }
};

// Set the JWT Token in an HTTP-only Cookie
export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookie = serialize("auth_token", token, {
    httpOnly: false, // Change to `false` for testing to see it in browser storage (change back to `true` in production)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax", // Set SameSite attribute for cross-site cookies
    maxAge: 60 * 60, // 1 hour
    path: "/", // Cookie is accessible site-wide
  });
  res.setHeader("Set-Cookie", cookie);
};

// Remove the JWT Token from the Cookie
export const removeTokenCookie = (res: NextApiResponse) => {
  const cookie = serialize("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
};
