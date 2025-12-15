import ProductRepository from "../repositories/ProductRepository.js";

const NotFoundError = (message) => new Error(message);
const BadRequestError = (message) => new Error(message);

class ProductService {
  async createProduct(productData, user) {
    try {
      const requiredFields = [
        "title",
        "description",
        "code",
        "price",
        "stock",
        "category",
      ];
      for (const field of requiredFields) {
        if (!productData[field]) {
          throw new Error(`Field ${field} is required`);
        }
      }

      if (user.role === "premium") {
        productData.owner = user.email;
      } else {
        productData.owner = "admin";
      }

      return await ProductRepository.createProduct(productData);
    } catch (error) {
      throw error;
    }
  }

  async getProducts(filters = {}, options = {}) {
    try {
      return await ProductRepository.getAllProducts(filters, options);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await ProductRepository.getProductById(productId);
      if (!product) {
        throw NotFoundError("Product not found");
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, updateData, user) {
    try {
      const existingProduct = await ProductRepository.getProductById(productId);
      if (!existingProduct) {
        throw NotFoundError("Product not found");
      }

      if (user.role === "premium" && existingProduct.owner !== user.email) {
        throw new Error("You can only update your own products");
      }

      return await ProductRepository.updateProduct(productId, updateData);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId, user) {
    try {
      const existingProduct = await ProductRepository.getProductById(productId);
      if (!existingProduct) {
        throw NotFoundError("Product not found");
      }

      if (user.role === "premium" && existingProduct.owner !== user.email) {
        throw new Error("You can only delete your own products");
      }

      return await ProductRepository.deleteProduct(productId);
    } catch (error) {
      throw error;
    }
  }

  async updateStock(productId, quantity) {
    try {
      const product = await ProductRepository.getProductById(productId);
      if (!product) {
        throw NotFoundError("Product not found");
      }

      if (product.stock + quantity < 0) {
        throw BadRequestError("Insufficient stock");
      }

      return await ProductRepository.updateStock(productId, quantity);
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
