import CartService from "../services/cartService.js";
import TicketService from "../services/ticketService.js";

class CartController {
  async getCart(req, res) {
    try {
      const cart = await CartService.getCart(req.user.id);
      res.json({
        status: "success",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async addProduct(req, res) {
    try {
      const { pid } = req.params;
      const { quantity = 1 } = req.body;

      const cart = await CartService.addProduct(req.user.id, pid, quantity);
      res.json({
        status: "success",
        payload: cart,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { pid } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          status: "error",
          message: "Quantity must be at least 1",
        });
      }

      const cart = await CartService.updateProductQuantity(
        req.user.id,
        pid,
        quantity
      );
      res.json({
        status: "success",
        payload: cart,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async removeProduct(req, res) {
    try {
      const { pid } = req.params;
      const cart = await CartService.removeProduct(req.user.id, pid);
      res.json({
        status: "success",
        payload: cart,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await CartService.clearCart(req.user.id);
      res.json({
        status: "success",
        payload: cart,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async purchase(req, res) {
    try {
      const cart = await CartService.getCart(req.user.id);

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Cart is empty",
        });
      }

      const purchaseResult = await TicketService.processPurchase(
        req.user.id,
        cart._id
      );

      res.json({
        status: "success",
        payload: purchaseResult,
        message:
          purchaseResult.purchased.length > 0
            ? "Purchase completed successfully"
            : "No products could be purchased",
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new CartController();
