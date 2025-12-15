import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["user", "premium", "admin"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;
