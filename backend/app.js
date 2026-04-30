import express, { json } from "express"
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js"
import {errorMiddleware} from "./middlewares/errorMiddleware.js"
import userRouter from "./router/userRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
import analyticsRouter from "./router/analyticsRouter.js"


const app = express();
config({path:"./config/config.env"});

app.use(
    cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL, "https://health-x-frontend.vercel.app", "https://health-x-dashboard.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    fileUpload ({
    useTempFiles: true,
    tempFileDir: "/tmp/",
})
);

// Health Check Routes
app.get("/", (req, res) => {
  res.send("HealthX API is running 🚀");
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "HealthX API v1 working ✅",
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/analytics", analyticsRouter);

// 404 Route handler
app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

dbConnection()

app.use(errorMiddleware);

export default app;