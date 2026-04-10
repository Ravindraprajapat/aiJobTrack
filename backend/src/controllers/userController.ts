import type { Request, Response } from "express";
import User from "../models/userModel.js";


// Custom Request (userId add karne ke liye)
interface AuthRequest extends Request {
  userId?: string;
}

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User Id not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: `get current user error ${error}`,
    });
  }
};