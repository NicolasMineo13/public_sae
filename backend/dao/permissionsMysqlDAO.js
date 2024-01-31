import { PermissionsDAO } from "./permissionsDAO.js";
import { getDatabaseInstance } from "../db.js";

export class PermissionsMysqlDAO extends PermissionsDAO {
    constructor() {
        super();
        this.db = getDatabaseInstance();
    }

    async getPermissions(filter) {
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

            // Construisez la requête
            let query = "SELECT * FROM permissions";
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const [results] = await db.execute(query, params);
            return results;
        } catch (error) {
            console.error("Erreur lors de la récupération des permissions :", error);
            throw error;
        }
    }

    async createPermission(libelle) {
        try {
            const db = await this.db;

            if (!libelle) {
                throw new Error("Paramètres manquants");
            }

            const [result] = await db.execute(
                "INSERT INTO permissions (libelle) VALUES (?)",
                [libelle]
            );

            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du permission :", error);
            throw error;
        }
    }

    async updatePermission(id, updatedFields) {
        try {
            const db = await this.db;

            const { libelle } = updatedFields;

            let query = "UPDATE permissions SET";
            const params = [];

            if (libelle) {
                query += " libelle = ?,";
                params.push(libelle);
            }

            query = query.slice(0, -1);
            query += " WHERE id = ?";
            params.push(id);

            const result = await db.execute(query, params);

            if (result[0].affectedRows > 0) {
                return true; // Mise à jour réussie
            } else {
                return false; // Aucun permission mis à jour (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la mise à jour du permission :", error);
            throw error;
        }
    }

    async deletePermission(id) {
        try {
            const db = await this.db;
            const result = await db.execute("DELETE FROM permissions WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                return true; // Suppression réussie
            } else {
                return false; // Aucun permission supprimé (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la suppression du permission :", error);
            throw error;
        }
    }
}