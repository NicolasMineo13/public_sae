import express from "express";
import utilisateursController from "../controllers/utilisateursController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes publiques
router.post("/login", utilisateursController.loginUtilisateur);
router.post("/", utilisateursController.createUtilisateur);
router.post("/logout/:id", utilisateursController.logoutUtilisateur);

// Routes privées
router.get("/", verifyToken, utilisateursController.getUtilisateurs);
router.patch("/:id", verifyToken, utilisateursController.updateUtilisateur);
router.delete("/:id", verifyToken, utilisateursController.deleteUtilisateur);

export default router;