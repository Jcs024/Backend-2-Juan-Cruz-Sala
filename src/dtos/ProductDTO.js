class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails;
    this.owner = product.owner;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }

  static fromProduct(product) {
    return new ProductDTO(product);
  }

  static fromProducts(products) {
    return products.map((product) => new ProductDTO(product));
  }

  static toPublicView(product) {
    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails,
    };
  }
}

export default ProductDTO;
