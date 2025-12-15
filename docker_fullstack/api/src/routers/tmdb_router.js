import express from "express";
import { searchByGenre,searchPersonMovies,searchMovies,getMovieDetails,getTrending,getNowInTheaters } from "../controllers/tmdb_controller.js";

const tmdbRouter = express.Router();

tmdbRouter.get("/search", searchMovies);
tmdbRouter.get("/genre", searchByGenre);
tmdbRouter.get("/person", searchPersonMovies);
tmdbRouter.get("/movie/:id", getMovieDetails);
tmdbRouter.get("/now", getNowInTheaters);
tmdbRouter.get("/trending", getTrending);


export default tmdbRouter;
