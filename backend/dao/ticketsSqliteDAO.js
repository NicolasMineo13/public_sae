import { TicketsDAO } from "./ticketsDAO.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export class TicketsSqliteDAO extends TicketsDAO {
    constructor() {
        super();
        this.dbPromise = open({
            filename: "./database/database.db",
            driver: sqlite3.Database,
        });
    }

    async getTickets(filter) {
        const db = await this.dbPromise;
        const conditions = [];
        const params = [];

        try {
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
                conditions.push("id_utilisateur_demandeur = ?");
                params.push(filter.id_utilisateur_demandeur);
            }

            if (filter.id_utilisateur_technicien) {
                conditions.push("id_utilisateur_technicien = ?");
                params.push(filter.id_utilisateur_technicien);
            }

            if (filter.id_statut) {
                conditions.push("id_statut = ?");
                params.push(filter.id_statut);
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

            return await db.all(query, params);
        } catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la récupération des tickets :", error);
            throw error;
        }
    }

    async createTicket(titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture) {
        const db = await this.dbPromise;

        if (!titre || !description || !date_creation || !id_utilisateur_demandeur || !id_utilisateur_technicien || !id_statut || !date_derniere_modif || !date_cloture) {
            throw new Error("Paramètres manquants");
        }

        return db.run(
            "INSERT INTO tickets (titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            titre,
            description,
            date_creation,
            id_utilisateur_demandeur,
            id_utilisateur_technicien,
            id_statut,
            date_derniere_modif,
            date_cloture
        );
    }

    async updateTicket(id, updatedFields) {
        const db = await this.dbPromise;

        const { titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture } = updatedFields;

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

        if (date_derniere_modif) {
            query += " date_derniere_modif = ?,";
            params.push(date_derniere_modif);
        }

        if (date_cloture) {
            query += " date_cloture = ?,";
            params.push(date_cloture);
        }

        query = query.slice(0, -1);
        query += " WHERE id = ?";
        params.push(id);

        const result = await db.run(query, params);

        if (result.changes > 0) {
            return true; // Mise à jour réussie
        } else {
            return false; // Aucun ticket mis à jour (id non trouvé)
        }
    }

    async deleteTicket(id) {
        const db = await this.dbPromise;
        const result = await db.run("DELETE FROM tickets WHERE id = ?", id);
        if (result.changes > 0) {
            return true; // Suppression réussie
        } else {
            return false; // Aucun ticket supprimé (id non trouvé)
        }
    }
}