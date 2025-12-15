import ProductService from "../services/productService.js";

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body, req.user);
      res.status(201).json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query, category, status } = req.query;

      const filters = query ? JSON.parse(query) : {};
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        category,
        status: status !== undefined ? status === "true" : null,
      };

      const products = await ProductService.getProducts(filters, options);
      res.json({
        status: "success",
        ...products,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.pid);

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(
        req.params.pid,
        req.body,
        req.user
      );

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deleted = await ProductService.deleteProduct(
        req.params.pid,
        req.user
      );

      if (!deleted) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }

      res.json({
        status: "success",
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new ProductController();
