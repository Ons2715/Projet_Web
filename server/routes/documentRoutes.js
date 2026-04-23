import { Router } from "express";
import { listAllDocuments } from "../controllers/documentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const documentRouter = Router();

documentRouter.get("/", asyncHandler(listAllDocuments));
