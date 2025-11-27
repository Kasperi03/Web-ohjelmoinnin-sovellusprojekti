import express from "express";
import { Router } from "express";
import { auth } from "../helper/auth.js";
import {
  addMovie,
  removeMovie,
  getMovies
} from "../controllers/group_movie_controller.js";

const GroupMovieRouter = Router();

GroupMovieRouter.get("/:groupId/movies", auth, getMovies);
GroupMovieRouter.post("/:groupId/:apiId", auth, addMovie);
GroupMovieRouter.delete("/:groupId/:movieId", auth, removeMovie);


export default GroupMovieRouter;
