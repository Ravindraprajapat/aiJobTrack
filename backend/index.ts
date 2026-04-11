import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import authRouter from "./src/routes/authRouter.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import userRouter from "./src/routes/userRouter.js";
import applicationRouter from "./src/routes/applicationRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); 

const PORT = process.env.PORT || 8000 

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/application",applicationRouter)



app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`); 
});
