import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

import userRouter from "./routes/userRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import ticketRouter from "./routes/ticketRouter.js";

const app = express();

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/tickets", ticketRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Email service: ${process.env.EMAIL_USER ? "Configured" : "Not configured"}`
  );
});
