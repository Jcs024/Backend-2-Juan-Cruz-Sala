import ProductDAO from "../dao/ProductDAO.js";
import ProductDTO from "../dtos/ProductDTO.js";

class ProductRepository {
  async createProduct(productData) {
    const product = await ProductDAO.create(productData);
    return ProductDTO.fromProduct(product);
  }

  async getAllProducts(query = {}, options = {}) {
    const result = await ProductDAO.findAll(query, options);
    return {
      ...result,
      docs: ProductDTO.fromProducts(result.docs),
    };
  }

  async getProductById(id) {
    const product = await ProductDAO.findById(id);
    return product ? ProductDTO.fromProduct(product) : null;
  }

  async updateProduct(id, updateData) {
    const product = await ProductDAO.update(id, updateData);
    return product ? ProductDTO.fromProduct(product) : null;
  }

  async deleteProduct(id) {
    return await ProductDAO.delete(id);
  }

  async updateStock(id, quantity) {
    const product = await ProductDAO.updateStock(id, quantity);
    return product ? ProductDTO.fromProduct(product) : null;
  }
}

export default new ProductRepository();
