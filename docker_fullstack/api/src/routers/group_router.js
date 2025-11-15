import { Router } from "express";
import { getGroups, getGroup, addGroup, updateGroup, deleteGroup } from "../controllers/group_controller.js";

const GroupRouter = Router();

GroupRouter.get("/", getGroups);
GroupRouter.get("/:id", getGroup);
GroupRouter.post("/", addGroup);
GroupRouter.put("/:id", updateGroup);
GroupRouter.delete("/:id", deleteGroup);

export default GroupRouter;
