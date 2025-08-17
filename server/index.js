import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import connectDb from './DB/connectDb.js';
import userRoute from './routes/user.routes.js';
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchase.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js"
import { stripeWebhook } from './controller/coursePurchase.controller.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 8080;
const __dirname = path.resolve(); // get the current directory name
app.post('/api/stripe/webhook', 
  express.raw({type: 'application/json'}), 
  (req, res, next) => {
    console.log('Webhook received! Path:', req.path); // Debugging
    next();
  },
  stripeWebhook
);
// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,    
    credentials: true,
}))




app.get("/home", (_, res)=>{
    res.status(200).send("Welcome to Home Page");
})
app.use("/api/media",mediaRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/purchase",purchaseRoute);
app.use("/api/progress", courseProgressRoute);




app.listen(port, ()=>{
    connectDb();
    console.log(`server is running at port ${port}`);
})



