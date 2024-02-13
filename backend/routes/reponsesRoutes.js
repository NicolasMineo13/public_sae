import express from "express";
import reponsesController from "../controllers/reponsesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes privées
router.get("/", verifyToken, reponsesController.getReponses);
router.post("/", verifyToken, reponsesController.createReponse);
router.patch("/:id", verifyToken, reponsesController.updateReponse);
router.delete("/:id", verifyToken, reponsesController.deleteReponse);

export default router;