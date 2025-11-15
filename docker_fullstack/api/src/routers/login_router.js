import { Router } from "express";
import { createUser, loginUser } from "../controllers/login_controller.js";

const loginRouter = Router()

loginRouter.post("/signup", createUser)
loginRouter.post("/signin", loginUser)

export default loginRouter