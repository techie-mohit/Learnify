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

// if .env is outside the server folder then we use in package.json "start": "nodemon server/index.js" otherwise it gives an error
const PORT  = process.env.PORT;

const __dirname = path.resolve(); // get the current directory name

app.post('/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhook);

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "https://learnify-uy89.onrender.com"
}))

app.get("/home", (_, res)=>{
    res.status(200).send("Welcome to Home Page");
})
app.use("/api/media",mediaRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/purchase",purchaseRoute);
app.use("/api/progress", courseProgressRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})


app.listen(PORT, ()=>{
    connectDb();
    console.log(`server is running at port ${PORT}`);
})



