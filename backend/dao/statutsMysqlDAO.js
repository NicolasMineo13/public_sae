import { StatutsDAO } from "./statutsDAO.js";
import { getDatabaseInstance } from "../db.js";

export class StatutsMysqlDAO extends StatutsDAO {
    constructor() {
        super();
        this.db = getDatabaseInstance();
    }

    async getStatuts(filter) {
        try {
            const db = await this.db;
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
            return results;
        } catch (error) {
            console.error("Erreur lors de la récupération des statuts :", error);
            throw error;
        }
    }

    async createStatut(libelle, couleur) {
        try {
            const db = await this.db;

            if (!libelle) {
                throw new Error("Paramètres manquants");
            }

            const [result] = await db.execute(
                "INSERT INTO statuts (libelle, couleur) VALUES (?, ?)",
                [libelle, couleur]
            );

            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du statut :", error);
            throw error;
        }
    }

    async updateStatut(id, updatedFields) {
        try {
            const db = await this.db;

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
                return true; // Mise à jour réussie
            } else {
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
            const db = await this.db;
            const result = await db.execute("DELETE FROM statuts WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                return true; // Suppression réussie
            } else {
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