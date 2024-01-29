import TicketsService from "../services/ticketsService.js";
import { Ticket } from "../models/ticket.js";

const TicketsController = {
    getTickets: async (req, res) => {
        const { id, titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture } = req.query;
        let conditions = {};

        if (id) {
            conditions.id = id;
        }

        if (titre) {
            conditions.titre = titre;
        }

        if (description) {
            conditions.description = description;
        }

        if (date_creation) {
            conditions.date_creation = date_creation;
        }

        if (id_utilisateur_demandeur) {
            conditions.id_utilisateur_demandeur = id_utilisateur_demandeur;
        }

        if (id_utilisateur_technicien) {
            conditions.id_utilisateur_technicien = id_utilisateur_technicien;
        }

        if (id_statut) {
            conditions.id_statut = id_statut;
        }

        if (date_derniere_modif) {
            conditions.date_derniere_modif = date_derniere_modif;
        }

        if (date_cloture) {
            conditions.date_cloture = date_cloture;
        }

        try {
            const tickets = await TicketsService.getTickets(
                conditions
            );

            const ticketsObject = tickets.map(ticket => new Ticket(
                ticket.id,
                ticket.titre,
                ticket.description,
                ticket.date_creation,
                ticket.id_utilisateur_demandeur,
                ticket.id_utilisateur_technicien,
                ticket.id_statut,
                ticket.date_derniere_modif,
                ticket.date_cloture
            ));

            res.json({ tickets: ticketsObject });
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la récupération des tickets",
                errorMsg: error.message,
            });
        }
    },

    createTicket: async (req, res) => {
        const { titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture } = req.query;

        try {
            const newTicket = await TicketsService.createTicket(
                titre,
                description,
                date_creation,
                id_utilisateur_demandeur,
                id_utilisateur_technicien,
                id_statut,
                date_derniere_modif,
                date_cloture
            );

            if (newTicket instanceof Error) {
                res.json({ status: false, error: newTicket.message });
            } else {
                res.json({ status: true });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la création du ticket",
                errorMsg: error.message,
            });
        }
    },

    updateTicket: async (req, res) => {
        const { id } = req.params;
        const updatedFields = req.query;

        if (!id) {
            res.status(400).json({
                error: "L'id du ticket est requis.",
            });
            return;
        }

        // Si pas de champs à mettre à jour
        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({
                error: "Aucun champ à mettre à jour.",
            });
            return;
        }

        try {
            const ticket = await TicketsService.updateTicket(
                id,
                updatedFields
            );
            if (ticket) {
                res.json({ status: true, message: "Ticket mis à jour avec succès." });
            } else {
                res.status(404).json({ error: "Ticket non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la mise à jour du ticket",
                errorMsg: error.message,
            });
        }
    },

    deleteTicket: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: "L'id du ticket est requis.",
            });
            return;
        }

        try {
            const ticket = await TicketsService.deleteTicket(id);
            if (ticket) {
                res.json({ status: true, message: "Ticket supprimé avec succès." });
            } else {
                res.status(404).json({ error: "Ticket non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la suppression du ticket",
                errorMsg: error.message,
            });
        }
    },
}

export default TicketsController;