import { Router } from "express";
import { submitReview } from "../controllers/movie_reviews_controller.js";
import { auth } from "../helper/auth.js";

const MoviereviewsRouter = Router();

MoviereviewsRouter.post("/", auth, submitReview);

export default MoviereviewsRouter;