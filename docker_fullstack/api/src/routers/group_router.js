import { Router } from "express";
import { getGroups, getGroup, addGroup, updateGroup, deleteGroup } from "../controllers/group_controller.js";
import { auth } from "../helper/auth.js"



const GroupRouter = Router();

GroupRouter.get("/", getGroups);
GroupRouter.get("/:id", getGroup);
//protected routes
GroupRouter.post("/",auth, addGroup);
GroupRouter.put("/:id",auth, updateGroup);
GroupRouter.delete("/:id",auth, deleteGroup);

export default GroupRouter;
