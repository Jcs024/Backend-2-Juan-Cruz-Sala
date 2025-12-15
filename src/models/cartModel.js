import mongoose from "mongoose";

const cartCollection = "carts";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    products: {
      type: [cartItemSchema],
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;
