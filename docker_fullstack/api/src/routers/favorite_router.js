import express from "express";
import { postFavorite, getFavorites, removeFavorite, getFavoritesPublic } from "../controllers/favorite_controller.js";

import { auth } from "../helper/auth.js";

const FavoriteRouter = express.Router();

FavoriteRouter.post("/", auth, postFavorite);

FavoriteRouter.get("/", auth, getFavorites);

FavoriteRouter.delete("/:tmdbId", auth, removeFavorite);

FavoriteRouter.get("/public/:userId", getFavoritesPublic);

export default FavoriteRouter;
