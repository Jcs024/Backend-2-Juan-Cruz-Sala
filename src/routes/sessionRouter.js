import { Router } from "express";
import passport from "passport";
import { generateToken, authMiddleware } from "../utils.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    try {
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      const token = generateToken(req.user);

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        status: "success",
        message: "Login successful",
        token,
        user: {
          id: req.user._id,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.get("/current", authMiddleware("current"), async (req, res) => {
  try {
    res.json({
      status: "success",
      payload: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({
    status: "success",
    message: "Logout successful",
  });
});

router.get("/failregister", (req, res) => {
  res.status(400).json({
    status: "error",
    message: "Register failed",
  });
});

router.get("/faillogin", (req, res) => {
  res.status(400).json({
    status: "error",
    message: "Login failed",
  });
});

export default router;
