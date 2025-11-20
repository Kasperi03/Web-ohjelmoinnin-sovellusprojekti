import { Router } from "express";
import { getGroups, getGroup, addGroup, updateGroup, deleteGroup } from "../controllers/group_controller.js";
import { auth } from "../helper/auth.js"
import { checkGroupMember } from "../helper/checkGroupMember.js";
import { checkGroupOwner } from "../helper/checkGroupOwner.js";




const GroupRouter = Router();

GroupRouter.get("/", getGroups);
GroupRouter.get("/:id",auth,checkGroupMember, getGroup);
//protected routes
GroupRouter.post("/",auth, addGroup);
GroupRouter.put("/:id",auth,checkGroupOwner, updateGroup);
GroupRouter.delete("/:id",auth,checkGroupOwner, deleteGroup);

export default GroupRouter;
