import { Router } from "express";
import { createUser, loginUser, deleteUser } from "../controllers/login_controller.js";

const loginRouter = Router()

loginRouter.post("/signup", createUser)
loginRouter.post("/signin", loginUser)
loginRouter.delete("/delete", deleteUser)

export default loginRouter