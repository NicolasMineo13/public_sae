import express from "express";
import rolesController from "../controllers/rolesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes privées
router.get("/", verifyToken, rolesController.getRoles);
router.post("/", verifyToken, rolesController.createRole);
router.patch("/:id", verifyToken, rolesController.updateRole);
router.delete("/:id", verifyToken, rolesController.deleteRole);

export default router;