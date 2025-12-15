import { Router } from "express";
import UserController from "../controllers/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authorization.js";

const router = Router();

router.use(authMiddleware("jwt"));

router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);

router.get("/", isAdmin, UserController.getAllUsers);
router.get("/:uid", isAdmin, UserController.getUserById);
router.put("/:uid/role", isAdmin, UserController.updateUserRole);
router.delete("/:uid", isAdmin, UserController.deleteUser);

router.post("/:uid/documents", UserController.uploadDocuments);
router.delete("/inactive", isAdmin, UserController.deleteInactiveUsers);

export default router;
