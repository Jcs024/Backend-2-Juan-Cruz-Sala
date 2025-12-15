import productModel from "../models/productModel.js";

class ProductDAO {
  async create(productData) {
    return await productModel.create(productData);
  }

  async findAll(query = {}, options = {}) {
    const {
      limit = 10,
      page = 1,
      sort = null,
      category = null,
      status = null,
    } = options;

    let filter = {};
    if (category) filter.category = category;
    if (status !== null) filter.status = status;
    if (query) Object.assign(filter, query);

    const queryOptions = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    if (sort) {
      queryOptions.sort = { price: sort === "asc" ? 1 : -1 };
    }

    return await productModel.paginate(filter, queryOptions);
  }

  async findById(id) {
    return await productModel.findById(id);
  }

  async update(id, updateData) {
    return await productModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await productModel.findByIdAndDelete(id);
  }

  async updateStock(id, quantity) {
    return await productModel.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }

  async findByOwner(owner) {
    return await productModel.find({ owner });
  }
}

export default new ProductDAO();
