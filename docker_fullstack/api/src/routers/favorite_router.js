import express from "express";
import { postFavorite, getFavorites } from "../controllers/favorite_controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";

const FavoriteRouter = express.Router(); // You named it FavoriteRouter here

// FIX: Use FavoriteRouter.post, not router.post
FavoriteRouter.post("/", authMiddleware, postFavorite);

// FIX: Use FavoriteRouter.get, not router.get
FavoriteRouter.get("/", authMiddleware, getFavorites);

export default FavoriteRouter;
