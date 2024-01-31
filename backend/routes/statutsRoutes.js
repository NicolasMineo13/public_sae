import express from "express";
import statutsController from "../controllers/statutsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes privées
router.get("/", verifyToken, statutsController.getStatuts);
router.post("/", verifyToken, statutsController.createStatut);
router.patch("/:id", verifyToken, statutsController.updateStatut);
router.delete("/:id", verifyToken, statutsController.deleteStatut);

export default router;