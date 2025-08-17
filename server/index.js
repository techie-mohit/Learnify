import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectDb from "./DB/connectDb.js";
import userRoute from "./routes/user.routes.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchase.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import { stripeWebhook } from "./controller/coursePurchase.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const __dirname = path.resolve();

// ⚡ Stripe webhook route should come BEFORE express.json()!
// It needs raw body to verify signature
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://learnify-hazel.vercel.app",
    credentials: true,
  })
);

// Routes
app.get("/home", (_, res) => {
  res.status(200).send("Welcome to Home Page");
});

app.use("/api/media", mediaRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/progress", courseProgressRoute);

// Start server
app.listen(port, () => {
  connectDb();
  console.log(`✅ Server is running at port ${port}`);
});
