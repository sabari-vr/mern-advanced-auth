import jwt from "jsonwebtoken";
import { Token } from "../models/user.model.js";

export const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const activeTokens = await Token.find({ userId: decoded.user.id });
    const tokenExists = activeTokens.some((t) => t.token === token);

    if (!tokenExists) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    if (activeTokens.length > 3) {
      return res
        .status(403)
        .json({ msg: "You can only log in on three devices simultaneously." });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
