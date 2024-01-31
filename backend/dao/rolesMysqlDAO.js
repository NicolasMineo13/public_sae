import { RolesDAO } from "./rolesDAO.js";
import { getDatabaseInstance } from "../db.js";

export class RolesMysqlDAO extends RolesDAO {
    constructor() {
        super();
        this.db = getDatabaseInstance();
    }

    async getRoles(filter) {
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
            let query = "SELECT * FROM roles";
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const [results] = await db.execute(query, params);
            return results;
        } catch (error) {
            console.error("Erreur lors de la récupération des roles :", error);
            throw error;
        }
    }

    async createRole(libelle) {
        try {
            const db = await this.db;

            if (!libelle) {
                throw new Error("Paramètres manquants");
            }

            const [result] = await db.execute(
                "INSERT INTO roles (libelle) VALUES (?)",
                [libelle]
            );

            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du role :", error);
            throw error;
        }
    }

    async updateRole(id, updatedFields) {
        try {
            const db = await this.db;

            const { libelle } = updatedFields;

            let query = "UPDATE roles SET";
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
                return false; // Aucun role mis à jour (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la mise à jour du role :", error);
            throw error;
        }
    }

    async deleteRole(id) {
        try {
            const db = await this.db;
            const result = await db.execute("DELETE FROM roles WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                return true; // Suppression réussie
            } else {
                return false; // Aucun role supprimé (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la suppression du role :", error);
            throw error;
        }
    }
}