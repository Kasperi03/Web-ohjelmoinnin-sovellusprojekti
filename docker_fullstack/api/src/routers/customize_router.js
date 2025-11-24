import { Router } from "express";
import { putGroupLayout, getGroupLayout } from "../controllers/customize_controller.js";

const customizeRouter = Router();

customizeRouter.put("/:groupId/layout", putGroupLayout);
customizeRouter.get("/:groupId/layout", getGroupLayout);

export default customizeRouter;

