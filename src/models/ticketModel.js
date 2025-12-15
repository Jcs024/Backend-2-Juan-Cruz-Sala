import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: Number,
      price: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "completed",
  },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;
