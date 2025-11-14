import { Router } from "express";
import userModel from "../models/userModel.js";
import { authMiddleware, authorizationMiddleware } from "../utils.js";

const router = Router();

router.use(authMiddleware("jwt"));

router.get("/", authorizationMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({
      status: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:uid", authorizationMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await userModel.findById(req.params.uid).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.json({
      status: "success",
      payload: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:uid", authorizationMiddleware(["admin"]), async (req, res) => {
  try {
    const { first_name, last_name, age, role } = req.body;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.params.uid,
        { first_name, last_name, age, role },
        { new: true }
      )
      .select("-password");

    res.json({
      status: "success",
      payload: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:uid", authorizationMiddleware(["admin"]), async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.uid);
    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put(
  "/premium/:uid",
  authorizationMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { role } = req.body;
      const validRoles = ["user", "premium", "admin"];

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid role",
        });
      }

      const updatedUser = await userModel
        .findByIdAndUpdate(req.params.uid, { role }, { new: true })
        .select("-password");

      res.json({
        status: "success",
        payload: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

export default router;
