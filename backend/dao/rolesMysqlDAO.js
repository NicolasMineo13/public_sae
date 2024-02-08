import { RolesDAO } from "./rolesDAO.js";
import { getDatabasePool } from "../db.js";

export class RolesMysqlDAO extends RolesDAO {
    constructor() {
        super();
        this.pool = getDatabasePool();
    }

    async getRoles(filter) {
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

            // Construisez la requête
            let query = "SELECT * FROM roles";
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const [results] = await db.execute(query, params);
            db.release();
            return results;
        } catch (error) {
            console.error("Erreur lors de la récupération des roles :", error);
            throw error;
        }
    }

    async createRole(libelle) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            if (!libelle) {
                db.release();
                throw new Error("Paramètres manquants");
            }

            const [result] = await db.execute(
                "INSERT INTO roles (libelle) VALUES (?)",
                [libelle]
            );

            db.release();
            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du role :", error);
            throw error;
        }
    }

    async updateRole(id, updatedFields) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

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
                db.release();
                return true; // Mise à jour réussie
            } else {
                db.release();
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
            const pool = await this.pool;
            const db = await pool.getConnection();

            const result = await db.execute("DELETE FROM roles WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                db.release();
                return true; // Suppression réussie
            } else {
                db.release();
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