import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "jwt_secret",
    { expiresIn: "24h" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "jwt_secret");
  } catch (error) {
    return null;
  }
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateTicketCode = () => {
  return `TICKET-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
};
