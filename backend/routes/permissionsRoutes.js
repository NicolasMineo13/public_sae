import express from "express";
import permissionsController from "../controllers/permissionsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes privées
router.get("/", verifyToken, permissionsController.getPermissions);
router.post("/", verifyToken, permissionsController.createPermission);
router.patch("/:id", verifyToken, permissionsController.updatePermission);
router.delete("/:id", verifyToken, permissionsController.deletePermission);

export default router;