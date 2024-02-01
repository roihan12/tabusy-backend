import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ErrorHandler from "./middleware/error.js";
import userRoutes from "./routes/user.js";
import shopRoutes from "./routes/shop.js";
import productRoutes from "./routes/product.js";
import eventRoutes from "./routes/event.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", express.static("uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/events", eventRoutes);

// Error Handler
app.use(ErrorHandler);

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/.env" });
}

export default app;
