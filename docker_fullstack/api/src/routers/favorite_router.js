import express from "express";
import { postFavorite, getFavorites, removeFavorite } from "../controllers/favorite_controller.js";

import { auth } from "../helper/auth.js";

const FavoriteRouter = express.Router();

FavoriteRouter.post("/", auth, postFavorite);

FavoriteRouter.get("/", auth, getFavorites);

FavoriteRouter.delete("/:tmdbId", auth, removeFavorite);
export default FavoriteRouter;
