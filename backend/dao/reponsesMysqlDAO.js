import { ReponsesDAO } from "./reponsesDAO.js";
import { getDatabasePool } from "../db.js";

export class ReponsesMysqlDAO extends ReponsesDAO {
    constructor() {
        super();
        this.pool = getDatabasePool();
    }

    async getReponses(filter) {
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

            if (filter.date_creation) {
                conditions.push("date_creation = ?");
                params.push(filter.date_creation);
            }

            if (filter.date_derniere_modif) {
                conditions.push("date_derniere_modif = ?");
                params.push(filter.date_derniere_modif);
            }

            if (filter.id_utilisateur) {
                if (!isNaN(parseInt(filter.id_utilisateur, 10))) {
                    conditions.push("id_utilisateur = ?");
                    params.push(filter.id_utilisateur);
                } else {
                    // Recherche d'ID d'utilisateur par nom ou prénom
                    const searchTerm = `%${filter.id_utilisateur}%`;
                    const [result] = await db.execute(
                        "SELECT id FROM utilisateurs WHERE nom LIKE ? OR prenom LIKE ?",
                        [searchTerm, searchTerm]
                    );
                    if (result && result.length > 0) {
                        conditions.push("id_utilisateur = ?");
                        params.push(result[0].id);
                    }
                }
            }

            if (filter.id_ticket) {
                if (!isNaN(parseInt(filter.id_ticket, 10))) {
                    conditions.push("id_ticket = ?");
                    params.push(filter.id_ticket);
                } else {
                    // Recherche d'ID d'utilisateur par nom ou prénom
                    const searchTerm = `%${filter.id_ticket}%`;
                    const [result] = await db.execute(
                        "SELECT id FROM tickets WHERE titre LIKE ? OR description LIKE ?",
                        [searchTerm, searchTerm]
                    );
                    if (result && result.length > 0) {
                        conditions.push("id_ticket = ?");
                        params.push(result[0].id);
                    }
                }
            }

            if (filter.solution) {
                conditions.push("solution = ?");
                params.push(filter.solution);
            }

            // Construisez la requête
            let query = "SELECT * FROM reponses";
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const [results] = await db.execute(query, params);
            db.release();
            return results;
        } catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la récupération des reponses :", error);
            throw error;
        }
    }

    async createReponse(libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            date_derniere_modif = date_creation;

            if (!libelle || !date_creation || !date_derniere_modif || !id_utilisateur || !id_ticket) {
                db.release();
                throw new Error("Paramètres manquants");
            }

            if (!solution) {
                solution = 0;
            }

            const [result] = await db.execute(
                "INSERT INTO reponses (libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution) VALUES (?, ?, ?, ?, ?, ?)",
                [libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution]
            );

            const result_update_ticket_date = await db.execute("UPDATE tickets SET date_derniere_modif = ? WHERE id = ?", [date_derniere_modif, id_ticket]);
            if (!result_update_ticket_date[0].affectedRows > 0) {
                throw new Error("Impossible d'update le ticket");
            }

            db.release();
            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du reponse :", error);
            throw error;
        }
    }

    async updateReponse(id, updatedFields) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const { libelle, date_creation, id_utilisateur, id_ticket, solution } = updatedFields;

            let query = "UPDATE reponses SET";
            const params = [];

            if (libelle) {
                query += " libelle = ?,";
                params.push(libelle);
            }

            if (date_creation) {
                query += " date_creation = ?,";
                params.push(date_creation);
            }

            const now = new Date();
            const date_derniere_modif = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
            query += " date_derniere_modif = ?,";
            params.push(date_derniere_modif);

            const result_update_ticket_date = await db.execute("UPDATE tickets SET date_derniere_modif = ? WHERE id = ?", [date_derniere_modif, id_ticket]);
            if (!result_update_ticket_date[0].affectedRows > 0) {
                throw new Error("Impossible d'update le ticket");
            }

            if (id_utilisateur) {
                query += " id_utilisateur = ?,";
                params.push(id_utilisateur);
            }

            if (id_ticket) {
                query += " id_ticket = ?,";
                params.push(id_ticket);
            }

            if (solution) {
                query += " solution = ?,";
                params.push(solution);
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
                return false; // Aucun reponse mis à jour (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la mise à jour du reponse :", error);
            throw error;
        }
    }

    async deleteReponse(id) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const id_ticket = await db.execute("SELECT id_ticket FROM reponses WHERE id = ?", [id]);

            const result = await db.execute("DELETE FROM reponses WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                db.release();
                const now = new Date();
                const date_derniere_modif = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
                const result_update_ticket_date = await db.execute("UPDATE tickets SET date_derniere_modif = ? WHERE id = ?", [date_derniere_modif, id_ticket[0][0].id_ticket]);
                if (!result_update_ticket_date[0].affectedRows > 0) {
                    throw new Error("Impossible d'update le ticket");
                } else {
                    return true; // Suppression réussie
                }
            } else {
                db.release();
                return false; // Aucun reponse supprimé (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la suppression du reponse :", error);
            throw error;
        }
    }
}