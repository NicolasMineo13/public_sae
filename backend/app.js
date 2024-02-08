import cors from 'cors';
import express from 'express';
import utilisateursRoutes from "./routes/utilisateursRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import rolesRoutes from "./routes/rolesRoutes.js";
import permissionsRoutes from "./routes/permissionsRoutes.js";
import statutsRoutes from "./routes/statutsRoutes.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import { getDatabasePool } from "./db.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connexion à la base de données
getDatabasePool();

app.use("/utilisateurs", utilisateursRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/roles", rolesRoutes);
app.use("/permissions", permissionsRoutes);
app.use("/statuts", statutsRoutes);
app.use("/verifyToken", verifyToken, (req, res) => {
    res.json({ status: true });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}.`);
});