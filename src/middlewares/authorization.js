import passport from "passport";
import ProductRepository from "../repositories/ProductRepository.js";

export const authMiddleware = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
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

export const authorizationMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No user found",
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `Forbidden: Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

export const isAdmin = authorizationMiddleware(["admin"]);
export const isPremium = authorizationMiddleware(["premium", "admin"]);
export const isUser = authorizationMiddleware(["user", "premium", "admin"]);

export const checkProductOwnership = async (req, res, next) => {
  try {
    const productId = req.params.pid || req.body.productId;
    const product = await ProductRepository.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (req.user.role === "premium" && product.owner === req.user.email) {
      return next();
    }

    return res.status(403).json({
      status: "error",
      message: "You do not have permission to modify this product",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
