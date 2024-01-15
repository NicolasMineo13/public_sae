import express from 'express';
import utilisateursRoutes from "./routes/utilisateursRoutes.js";
import { verifyToken } from "./middlewares/verifyToken.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/utilisateurs", utilisateursRoutes);
app.use("/verifyToken", verifyToken, (req, res) => {
    res.json({ status: true });
});

app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}.`);
});