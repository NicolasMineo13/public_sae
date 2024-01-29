import express from "express";
import ticketsController from "../controllers/ticketsController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes privées
router.get("/", verifyToken, ticketsController.getTickets);
router.post("/", verifyToken, ticketsController.createTicket);
router.patch("/:id", verifyToken, ticketsController.updateTicket);
router.delete("/:id", verifyToken, ticketsController.deleteTicket);

export default router;