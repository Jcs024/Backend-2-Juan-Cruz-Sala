import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
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

export const authMiddleware = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: info?.message || "Unauthorized",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorizationMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: Insufficient permissions",
      });
    }
    next();
  };
};
