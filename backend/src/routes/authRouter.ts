import express from "express";
import { signIn, signOut, signUp, googleAuth } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.post("/googleAuth", googleAuth);

export default authRouter;