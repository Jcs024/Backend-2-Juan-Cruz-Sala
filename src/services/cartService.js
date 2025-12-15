import CartRepository from "../repositories/CartRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";

class CartService {
  async getCart(userId) {
    try {
      const cart = await CartRepository.getCartByUser(userId);
      if (!cart) {
        return await CartRepository.createCart(userId);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProduct(userId, productId, quantity = 1) {
    try {
      const product = await ProductRepository.getProductById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      let cart = await CartRepository.getCartByUser(userId);
      if (!cart) {
        cart = await CartRepository.createCart(userId);
      }

      const updatedCart = await CartRepository.addToCart(
        cart._id,
        productId,
        quantity
      );

      const total = await CartRepository.calculateCartTotal(
        updatedCart.products
      );
      await CartRepository.updateCartTotal(cart._id, total);

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(userId, productId, quantity) {
    try {
      if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }

      const cart = await CartRepository.getCartByUser(userId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const product = await ProductRepository.getProductById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      const updatedCart = await CartRepository.updateProductQuantity(
        cart._id,
        productId,
        quantity
      );

      const total = await CartRepository.calculateCartTotal(
        updatedCart.products
      );
      await CartRepository.updateCartTotal(cart._id, total);

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(userId, productId) {
    try {
      const cart = await CartRepository.getCartByUser(userId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const updatedCart = await CartRepository.removeFromCart(
        cart._id,
        productId
      );

      const total = await CartRepository.calculateCartTotal(
        updatedCart.products
      );
      await CartRepository.updateCartTotal(cart._id, total);

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      const cart = await CartRepository.getCartByUser(userId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      return await CartRepository.clearCart(cart._id);
    } catch (error) {
      throw error;
    }
  }

  async calculateCartTotal(userId) {
    try {
      const cart = await CartRepository.getCartByUser(userId);
      if (!cart) {
        return 0;
      }

      return await CartRepository.calculateCartTotal(cart.products);
    } catch (error) {
      throw error;
    }
  }
}

export default new CartService();
