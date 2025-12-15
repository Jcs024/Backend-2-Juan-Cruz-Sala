import TicketRepository from "../repositories/TicketRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import CartRepository from "../repositories/CartRepository.js";
import EmailService from "./emailService.js";
import UserRepository from "../repositories/UserRepository.js";
import { generateTicketCode } from "../utils.js";

class TicketService {
  async processPurchase(userId, cartId) {
    try {
      const cart = await CartRepository.getCartByUser(userId);

      if (!cart || cart.products.length === 0) {
        throw new Error("Cart is empty");
      }

      const purchaseResult = {
        purchased: [],
        notPurchased: [],
        ticket: null,
      };

      let totalAmount = 0;

      for (const item of cart.products) {
        const product = await ProductRepository.getProductById(
          item.product._id
        );

        if (!product) {
          purchaseResult.notPurchased.push({
            product: item.product._id,
            reason: "Product not found",
          });
          continue;
        }

        if (product.stock >= item.quantity) {
          await ProductRepository.updateStock(product.id, item.quantity);

          purchaseResult.purchased.push({
            product: product.id,
            quantity: item.quantity,
            price: product.price,
          });

          totalAmount += product.price * item.quantity;
        } else {
          purchaseResult.notPurchased.push({
            product: product.id,
            reason: "Insufficient stock",
            available: product.stock,
          });
        }
      }

      if (purchaseResult.purchased.length > 0) {
        const ticketData = {
          code: generateTicketCode(),
          amount: totalAmount,
          purchaser: userId,
          products: purchaseResult.purchased,
        };

        const ticket = await TicketRepository.createTicket(ticketData);
        purchaseResult.ticket = ticket;

        const user = await UserRepository.findUserById(userId);
        if (user) {
          await EmailService.sendPurchaseConfirmation(user.email, ticket);
        }
      }

      if (purchaseResult.notPurchased.length > 0) {
        const remainingProducts = cart.products.filter((item) =>
          purchaseResult.notPurchased.some(
            (np) => np.product.toString() === item.product._id.toString()
          )
        );

        await CartRepository.clearCart(cartId);
        for (const item of remainingProducts) {
          await CartRepository.addToCart(
            cartId,
            item.product._id,
            item.quantity
          );
        }
      } else {
        await CartRepository.clearCart(cartId);
      }

      return purchaseResult;
    } catch (error) {
      throw error;
    }
  }

  async getPurchaseHistory(userId) {
    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await TicketRepository.getTicketsByPurchaser(userId);
  }
}

export default new TicketService();
