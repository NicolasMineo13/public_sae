import { DAOMysqlFactory } from "../factory/DAOMysqlFactory.js";

const mysqlFactory = new DAOMysqlFactory();
const ticketsDAO = mysqlFactory.createTicketsDAO();

const TicketsService = {
    getTickets: async (conditions) => {
        return await ticketsDAO.getTickets(conditions);
    },

    createTicket: async (titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture) => {
        return await ticketsDAO.createTicket(titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture);
    },

    updateTicket: async (id, updatedFields) => {
        return await ticketsDAO.updateTicket(id, updatedFields);
    },

    deleteTicket: async (id) => {
        return await ticketsDAO.deleteTicket(id);
    },
};

export default TicketsService;