import { Router } from "express";
import { createUser, loginUser, deleteUser } from "../controllers/login_controller.js";
import { auth } from "../helper/auth.js";

const loginRouter = Router()

loginRouter.post("/signup", createUser)
loginRouter.post("/signin", loginUser)
loginRouter.delete("/delete", auth, deleteUser)

export default loginRouter