import { Router } from "express";
import {
  submitReview,
  getMovieReviews,
  deleteMyReview,
} from "../controllers/movie_reviews_controller.js";
import { auth } from "../helper/auth.js";

const MoviereviewsRouter = Router();

MoviereviewsRouter.post("/", auth, submitReview);

MoviereviewsRouter.get("/:movieId", getMovieReviews);

MoviereviewsRouter.delete("/:movieId", auth, deleteMyReview);

export default MoviereviewsRouter;
