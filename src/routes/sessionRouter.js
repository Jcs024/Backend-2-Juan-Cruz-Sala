import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/sessionController.js";
import { authMiddleware } from "../middlewares/authorization.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  SessionController.register
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  SessionController.login
);

router.get("/current", authMiddleware("current"), SessionController.current);

router.post("/logout", SessionController.logout);

router.post("/password-reset", SessionController.requestPasswordReset);

router.post("/reset-password", SessionController.resetPassword);

export default router;
