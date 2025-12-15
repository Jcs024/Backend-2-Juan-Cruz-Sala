import passport from "passport";

export const authMiddleware = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        console.error("Auth error:", err);
        return res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
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

export const updateLastConnection = async (req, res, next) => {
  if (req.user) {
    try {
      await UserRepository.updateUser(req.user.id, {
        last_connection: new Date(),
      });
    } catch (error) {
      console.error("Error updating last connection:", error);
    }
  }
  next();
};
