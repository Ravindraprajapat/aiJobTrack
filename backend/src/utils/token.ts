import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const genToken = (userId: string): string => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    console.error("Error in Token generate", error);
    throw new Error("Token generation failed");
  }
};