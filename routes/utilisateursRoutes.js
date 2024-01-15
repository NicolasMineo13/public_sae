import express from "express";
import utilisateursController from "../controllers/utilisateursController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes publiques
router.post("/login", utilisateursController.loginUtilisateur);

// Routes privées
router.get("/", verifyToken, utilisateursController.getUtilisateurs);
router.post("/", utilisateursController.createUtilisateur);
router.patch("/:id", verifyToken, utilisateursController.updateUtilisateur);
router.delete("/:id", verifyToken, utilisateursController.deleteUtilisateur);
router.post("/logout/:id", verifyToken, utilisateursController.logoutUtilisateur);

export default router;