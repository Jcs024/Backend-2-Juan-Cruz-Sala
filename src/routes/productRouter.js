import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/authorization.js";
import {
  isAdmin,
  checkProductOwnership,
} from "../middlewares/authorization.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:pid", ProductController.getProductById);

router.post(
  "/",
  authMiddleware("jwt"),
  isAdmin,
  ProductController.createProduct
);

router.put(
  "/:pid",
  authMiddleware("jwt"),
  isAdmin,
  checkProductOwnership,
  ProductController.updateProduct
);

router.delete(
  "/:pid",
  authMiddleware("jwt"),
  isAdmin,
  checkProductOwnership,
  ProductController.deleteProduct
);

export default router;
