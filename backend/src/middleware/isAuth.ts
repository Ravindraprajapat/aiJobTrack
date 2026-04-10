import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  userId?: string;
}

export const isAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    req.userId = decoded.userId;

    next();
  } catch (error: any) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};