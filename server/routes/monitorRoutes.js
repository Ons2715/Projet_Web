import { Router } from "express";
import { listAllMonitors } from "../controllers/monitorController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const monitorRouter = Router();

monitorRouter.get("/", asyncHandler(listAllMonitors));
