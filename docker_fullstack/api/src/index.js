import express from "express";
import cors from "cors";
import "dotenv/config";

// Routers
import GroupRouter from "./routers/group_router.js";
import GroupMemberRouter from "./routers/group_member_router.js";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get("/", (req, res) => {
  res.send("Postgres API");
});

// Group routes
app.use("/groups", GroupRouter);

// Group member routes
app.use("/group-members", GroupMemberRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
