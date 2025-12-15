import { Router } from "express";
import CartController from "../controllers/cartController.js";
import { authMiddleware, isUser } from "../middlewares/authorization.js";

const router = Router();

router.use(authMiddleware("jwt"));

router.get("/", isUser, CartController.getCart);

router.post("/add/:pid", isUser, CartController.addProduct);

router.put("/update/:pid", isUser, CartController.updateProductQuantity);

router.delete("/remove/:pid", isUser, CartController.removeProduct);

router.delete("/clear", isUser, CartController.clearCart);

router.post("/purchase", isUser, CartController.purchase);

export default router;
