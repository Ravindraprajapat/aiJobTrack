import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { genToken } from "../utils/token.js";



export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

   


    const hashPassword = await bcrypt.hash(password, 10);

    
    user = await User.create({
      name,
      email,
      password: hashPassword,
    });

   
    const token = genToken(user._id.toString());

   
    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Sign up error", error });
  }
};


export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = genToken(user._id.toString());

    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Error in sign in`, error });
  }
};


export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out success" });
  } catch (error) {
    return res.status(500).json({ message: "Sign out error", error });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });
     
    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(generatedPassword, 10);
      
      user = await User.create({
        name,
        email,
        password: hashPassword,
      });
    }

    const token = genToken(user._id.toString());

    res.cookie("token", token, {
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Google Auth error", error });
  }
};
