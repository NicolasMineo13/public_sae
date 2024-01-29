export class TicketsDAO {
    getTickets(filter) {
        throw new Error("getTickets method not implemented.");
    }

    createTicket(titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloturee) {
        throw new Error("createTicket method not implemented.");
    }

    updateTicket(id, updatedFields) {
        throw new Error("updateTicket method not implemented.");
    }

    deleteTicket(id) {
        throw new Error("deleteTicket method not implemented.");
    }
}