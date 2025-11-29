import { Router } from "express";
import { auth } from "../helper/auth.js"; 

import {
  getMyProfile,
  updateEmail,
  updateUsername,
  updatePassword,
  getUserPublicById,
} from "../controllers/profile_controller.js";

const ProfileRouter = Router();

ProfileRouter.get("/", auth, getMyProfile);
ProfileRouter.put("/email", auth, updateEmail);
ProfileRouter.put("/username", auth, updateUsername);
ProfileRouter.put("/password", auth, updatePassword);
ProfileRouter.get("/public/:userId", getUserPublicById);

export default ProfileRouter;
