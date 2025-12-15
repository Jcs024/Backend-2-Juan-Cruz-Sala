import cartModel from "../models/cartModel.js";

class CartDAO {
  async create(userId) {
    return await cartModel.create({ user: userId });
  }

  async findByUser(userId) {
    return await cartModel
      .findOne({ user: userId })
      .populate("products.product");
  }

  async addProduct(cartId, productId, quantity = 1) {
    return await cartModel.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    );
  }

  async addNewProduct(cartId, productId, quantity = 1) {
    return await cartModel.findByIdAndUpdate(
      cartId,
      { $push: { products: { product: productId, quantity } } },
      { new: true }
    );
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await cartModel.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
  }

  async removeProduct(cartId, productId) {
    return await cartModel.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    );
  }

  async clearCart(cartId) {
    return await cartModel.findByIdAndUpdate(
      cartId,
      { products: [], total: 0 },
      { new: true }
    );
  }

  async updateTotal(cartId, total) {
    return await cartModel.findByIdAndUpdate(cartId, { total }, { new: true });
  }

  async delete(cartId) {
    return await cartModel.findByIdAndDelete(cartId);
  }
}

export default new CartDAO();
