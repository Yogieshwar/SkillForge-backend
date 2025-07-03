import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv"
dotenv.config();

export const protect = async (req, res, next) => {
    // console.log("Auth header:", req.headers.authorization);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log("Extracted token:", token);

      // console.log("JWT_SECRET at startup:", process.env.JWT_SECRET);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded JWT payload:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      // console.log("User fetched from DB:", req.user);

      next();
    } catch (error) {
      console.error("Token error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
     console.log("No token found or header does not start with Bearer");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
