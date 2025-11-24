import express from "express";
import cors from "cors";
import "dotenv/config";

// Routers
import GroupRouter from "./routers/group_router.js";
import GroupMemberRouter from "./routers/group_member_router.js";
import loginRouter from "./routers/login_router.js";
import ProfileRouter from "./routers/profile_router.js";
import FavoriteRouter from "./routers/favorite_router.js";
import GroupMovieRouter from "./routers/group_movies_router.js";
import customizeRouter from "./routers/customize_router.js";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get("/", (req, res) => {
  res.send("Postgres API");
});

// Group member routes
app.use("/groups", GroupMemberRouter);
// Group routes
app.use("/groups", GroupRouter);
app.use("/group-movies", GroupMovieRouter);
app.use("/customize", customizeRouter);

// Login routes
app.use("/login", loginRouter);

app.use("/profile", ProfileRouter);

app.use("/api/favorites", FavoriteRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
