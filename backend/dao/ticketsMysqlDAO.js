import { TicketsDAO } from "./ticketsDAO.js";
import { getDatabasePool } from "../db.js";

export class TicketsMysqlDAO extends TicketsDAO {
    constructor() {
        super();
        this.pool = getDatabasePool();
    }

    async getTickets(filter) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const conditions = [];
            const params = [];

            if (filter.id) {
                conditions.push("id = ?");
                params.push(filter.id);
            }

            if (filter.titre) {
                conditions.push("titre = ?");
                params.push(filter.titre);
            }

            if (filter.description) {
                conditions.push("description = ?");
                params.push(filter.description);
            }

            if (filter.date_creation) {
                conditions.push("date_creation = ?");
                params.push(filter.date_creation);
            }

            if (filter.id_utilisateur_demandeur) {
                if (!isNaN(parseInt(filter.id_utilisateur_demandeur, 10))) {
                    conditions.push("id_utilisateur_demandeur = ?");
                    params.push(filter.id_utilisateur_demandeur);
                } else {
                    // Recherche d'ID d'utilisateur par nom ou prénom
                    const searchTerm = `%${filter.id_utilisateur_demandeur}%`;
                    const [result] = await db.execute(
                        "SELECT id FROM utilisateurs WHERE nom LIKE ? OR prenom LIKE ?",
                        [searchTerm, searchTerm]
                    );
                    if (result && result.length > 0) {
                        conditions.push("id_utilisateur_demandeur = ?");
                        params.push(result[0].id);
                    }
                }
            }

            if (filter.id_utilisateur_technicien) {
                if (!isNaN(parseInt(filter.id_utilisateur_technicien, 10))) {
                    conditions.push("id_utilisateur_technicien = ?");
                    params.push(filter.id_utilisateur_technicien);
                } else {
                    // Recherche d'ID d'utilisateur par nom ou prénom
                    const searchTerm = `%${filter.id_utilisateur_technicien}%`;
                    const [result] = await db.execute(
                        "SELECT id FROM utilisateurs WHERE nom LIKE ? OR prenom LIKE ?",
                        [searchTerm, searchTerm]
                    );
                    if (result && result.length > 0) {
                        conditions.push("id_utilisateur_technicien = ?");
                        params.push(result[0].id);
                    }
                }
            }

            if (filter.id_statut) {
                if (!isNaN(parseInt(filter.id_statut, 10))) {
                    conditions.push("id_statut = ?");
                    params.push(filter.id_statut);
                } else {
                    // Recherche d'ID d'utilisateur par libellé
                    const searchTerm = `%${filter.id_statut}%`;
                    const [result] = await db.execute(
                        "SELECT id FROM statuts WHERE libelle LIKE ?",
                        [searchTerm]
                    );
                    if (result && result.length > 0) {
                        conditions.push("id_statut = ?");
                        params.push(result[0].id);
                    }
                }
            }

            if (filter.date_derniere_modif) {
                conditions.push("date_derniere_modif = ?");
                params.push(filter.date_derniere_modif);
            }

            if (filter.date_cloture) {
                conditions.push("date_cloture = ?");
                params.push(filter.date_cloture);
            }

            // Construisez la requête
            let query = "SELECT * FROM tickets";
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            if (filter.sort) {
                query += ` ORDER BY ${filter.sort}`;
            }

            if (filter.sens) {
                query += ` ${filter.sens}`;
            }

            const [results] = await db.execute(query, params);
            db.release();
            return results;
        } catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la récupération des tickets :", error);
            throw error;
        }
    }

    async createTicket(titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            if (!id_utilisateur_technicien) {
                id_utilisateur_technicien = null;
            }

            if (!titre || !description || !date_creation || !id_utilisateur_demandeur || !id_statut) {
                db.release();
                throw new Error("Paramètres manquants");
            }

            const [result] = await db.execute(
                "INSERT INTO tickets (titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_creation, null]
            );

            db.release();
            return result.insertId;
        }
        catch (error) {
            console.error("Erreur lors de la création du ticket :", error);
            throw error;
        }
    }

    async updateTicket(id, updatedFields) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const { titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_cloture } = updatedFields;

            let query = "UPDATE tickets SET";
            const params = [];

            if (titre) {
                query += " titre = ?,";
                params.push(titre);
            }

            if (description) {
                query += " description = ?,";
                params.push(description);
            }

            if (date_creation) {
                query += " date_creation = ?,";
                params.push(date_creation);
            }

            if (id_utilisateur_demandeur) {
                query += " id_utilisateur_demandeur = ?,";
                params.push(id_utilisateur_demandeur);
            }

            if (id_utilisateur_technicien) {
                query += " id_utilisateur_technicien = ?,";
                params.push(id_utilisateur_technicien);
            }

            if (id_statut) {
                query += " id_statut = ?,";
                params.push(id_statut);
            }

            const now = new Date();
            const date_derniere_modif = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
            query += " date_derniere_modif = ?,";
            params.push(date_derniere_modif);

            if (date_cloture) {
                query += " date_cloture = ?,";
                params.push(date_cloture);
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
                return false; // Aucun ticket mis à jour (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la mise à jour du ticket :", error);
            throw error;
        }
    }

    async deleteTicket(id) {
        try {
            const pool = await this.pool;
            const db = await pool.getConnection();

            const result = await db.execute("DELETE FROM tickets WHERE id = ?", [id]);
            if (result[0].affectedRows > 0) {
                db.release();
                return true; // Suppression réussie
            } else {
                db.release();
                return false; // Aucun ticket supprimé (id non trouvé)
            }
        }
        catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la suppression du ticket :", error);
            throw error;
        }
    }
}