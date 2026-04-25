import { Router } from "express";
import {
  createOneReclamation,
  listAllReclamations,
  treatOneReclamation
} from "../controllers/reclamationController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const reclamationRouter = Router();

reclamationRouter.get("/", requireAuth, requireRole("admin"), asyncHandler(listAllReclamations));
reclamationRouter.post("/", requireAuth, asyncHandler(createOneReclamation));
reclamationRouter.patch("/:id/traiter", requireAuth, requireRole("admin"), asyncHandler(treatOneReclamation));
