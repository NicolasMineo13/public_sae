import { StatutsDAO } from "./statutsDAO.js";
import { getDatabasePool } from "../db.js";

export class StatutsMysqlDAO extends StatutsDAO {
    constructor() {
        super();
        this.pool = getDatabasePool();
    }

    async getStatuts(filter) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const conditions = [];
            const params = [];

            if (filter.id) {
                conditions.push("id = ?");
                params.push(filter.id);
            }

            if (filter.libelle) {
                conditions.push("libelle = ?");
                params.push(filter.libelle);
            }

            if (filter.couleur) {
                conditions.push("couleur = ?");
                params.push(filter.couleur);
            }

            // Construisez la requête
            let query = "SELECT * FROM statuts";
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const [results] = await db.execute(query, params);
            db.release();
            return results;
        } catch (error) {
            console.error("Erreur lors de la récupération des statuts :", error);
            throw error;
        }
    }

    async createStatut(libelle, couleur) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            if (!libelle) {
                db.release();
                throw new Error("Paramètres manquants");
            }

            const [result] = await db.execute(
                "INSERT INTO statuts (libelle, couleur) VALUES (?, ?)",
                [libelle, couleur]
            );

            db.release();
            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du statut :", error);
            throw error;
        }
    }

    async updateStatut(id, updatedFields) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            let { libelle, couleur } = updatedFields;

            let query = "UPDATE statuts SET";
            const params = [];

            if (libelle) {
                query += " libelle = ?,";
                params.push(libelle);
            }

            if (couleur) {
                query += " couleur = ?,";
                params.push(couleur);
            } else {
                query += " couleur = null,";
            }

            query = query.slice(0, -1);
            query += " WHERE id = ?";
            params.push(id);

            const result = await db.execute(query, params);

            if (result[0].affectedRows > 0) {
                db.release();
                return true; // Mise à jour réussie
            } else {
                db.release();
                return false; // Aucun statut mis à jour (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la mise à jour du statut :", error);
            throw error;
        }
    }

    async deleteStatut(id) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const result = await db.execute("DELETE FROM statuts WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                db.release();
                return true; // Suppression réussie
            } else {
                db.release();
                return false; // Aucun statut supprimé (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la suppression du statut :", error);
            throw error;
        }
    }
}