import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

import userRouter from "./routes/userRouter.js";
import sessionRouter from "./routes/sessionRouter.js";

const app = express();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";
mongoose.connect(uri);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

app.get("/", (req, res) => {
  res.json({ message: "Ecommerce API running" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
