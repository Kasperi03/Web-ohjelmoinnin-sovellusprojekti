
import { Router } from "express";
import jwt from "jsonwebtoken";

import {
  getMyProfile,
  updateEmail,
  updateUsername,
  updatePassword,
} from "../controllers/profile_controller.js";

const router = Router();

function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.get("/", auth, getMyProfile);
router.put("/email", auth, updateEmail);
router.put("/username", auth, updateUsername);
router.put("/password", auth, updatePassword);

export default router;
