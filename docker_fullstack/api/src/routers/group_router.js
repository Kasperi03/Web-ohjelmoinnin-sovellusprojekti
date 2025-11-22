import { Router } from "express";
import { getGroups, getGroup, addGroup, updateGroup, deleteGroup,getGroupsForUser } from "../controllers/group_controller.js";
import { auth } from "../helper/auth.js"
import { checkGroupMember } from "../helper/checkGroupMember.js";
import { checkGroupOwner } from "../helper/checkGroupOwner.js";




const GroupRouter = Router();
GroupRouter.get("/me", auth, getGroupsForUser);
GroupRouter.get("/", getGroups);


//protected routes
GroupRouter.get("/:id",auth,checkGroupMember, getGroup);
GroupRouter.post("/",auth, addGroup);
GroupRouter.put("/:id",auth,checkGroupOwner, updateGroup);
GroupRouter.delete("/:id",auth,checkGroupOwner, deleteGroup);
GroupRouter.get("/me", auth, getGroupsForUser);


export default GroupRouter;
