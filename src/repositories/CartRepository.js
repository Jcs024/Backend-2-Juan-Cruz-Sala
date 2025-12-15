import CartDAO from "../dao/CartDAO.js";
import ProductRepository from "./ProductRepository.js";

class CartRepository {
  async createCart(userId) {
    return await CartDAO.create(userId);
  }

  async getCartByUser(userId) {
    return await CartDAO.findByUser(userId);
  }

  async addToCart(cartId, productId, quantity = 1) {
    const cart = await CartDAO.findByUser(cartId);
    const existingProduct = cart?.products?.find(
      (item) => item.product._id.toString() === productId
    );

    if (existingProduct) {
      return await CartDAO.addProduct(cartId, productId, quantity);
    } else {
      return await CartDAO.addNewProduct(cartId, productId, quantity);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await CartDAO.updateProductQuantity(cartId, productId, quantity);
  }

  async removeFromCart(cartId, productId) {
    return await CartDAO.removeProduct(cartId, productId);
  }

  async clearCart(cartId) {
    return await CartDAO.clearCart(cartId);
  }

  async updateCartTotal(cartId, total) {
    return await CartDAO.updateTotal(cartId, total);
  }

  async deleteCart(cartId) {
    return await CartDAO.delete(cartId);
  }

  async calculateCartTotal(products) {
    let total = 0;
    for (const item of products) {
      const product = await ProductRepository.getProductById(item.product);
      if (product && product.status && product.stock >= item.quantity) {
        total += product.price * item.quantity;
      }
    }
    return total;
  }
}

export default new CartRepository();
