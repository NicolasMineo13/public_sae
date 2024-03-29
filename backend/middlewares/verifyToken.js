import jwt from "jsonwebtoken";
import { getDatabasePool } from "../db.js";

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    const refreshToken = req.headers["refresh-token"];

    if (!token) {
        return res.status(403).json({ error: "Token manquant" });
    }

    if (!refreshToken) {
        return res.status(403).json({ error: "Refresh token manquant" });
    }

    const pool = await getDatabasePool();

    try {
        const db = await pool.getConnection();

        const [blacklist] = await db.execute(
            "SELECT * FROM tokensblacklist WHERE token = ?",
            [token]
        );

        if (blacklist && blacklist.length > 0) {
            db.release();
            return res.status(403).json({ error: "Token invalide" });
        }

        const [blacklistRefresh] = await db.execute(
            "SELECT * FROM tokensblacklist WHERE token = ?",
            [refreshToken]
        );

        if (blacklistRefresh && blacklistRefresh.length > 0) {
            db.release();
            return res.status(403).json({ error: "Refresh token invalide" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            db.release();
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                try {
                    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const newToken = jwt.sign({ userId: decodedRefresh.userId, login: decodedRefresh.login }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

                    const [oldTokenRow] = await db.execute("SELECT token FROM utilisateurs WHERE id = ?", [decodedRefresh.userId]);

                    if (!oldTokenRow || oldTokenRow.length === 0) {
                        throw new Error("Utilisateur non connecté");
                    }

                    const oldToken = oldTokenRow[0].token;

                    const [updateTokenResult] = await db.execute("UPDATE utilisateurs SET token = ? WHERE id = ?", [newToken, decodedRefresh.userId]);

                    if (updateTokenResult && updateTokenResult.affectedRows < 1) {
                        throw new Error("Problème d'ajout du token");
                    }

                    const [addBlacklistResult] = await db.execute("INSERT INTO tokensblacklist (token) VALUES (?)", [oldToken]);

                    if (addBlacklistResult && addBlacklistResult.affectedRows < 1) {
                        throw new Error("Problème d'insertion du token dans la blacklist");
                    }

                    return res.status(200).json({ status: true, token: newToken });
                } catch (refreshError) {
                    db.release();
                    console.error("Erreur de vérification du token de rafraîchissement :", refreshError.message);
                    return res.status(401).json({ error: refreshError.message });
                }
            } else {
                db.release();
                return res.status(401).json({ error: error.message });
            }
        }
    } catch (error) {
        console.error('Erreur de connexion à la base de données :', error);
        return res.status(500).json({ error: "Erreur de connexion à la base de données" });
    }
};

export { verifyToken };