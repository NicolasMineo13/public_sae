import { DAOFactory } from "./DAOFactory.js";
import { UtilisateursSqliteDAO } from "../dao/utilisateursSqliteDAO.js";
import { TicketsSqliteDAO } from "../dao/ticketsSqliteDAO.js";

export class DAOSqliteFactory extends DAOFactory {
    constructor() {
        super(); // Appel du constructeur de la classe parente
    }

    createUtilisateursDAO() {
        return new UtilisateursSqliteDAO();
    }

    createTicketsDAO() {
        return new TicketsSqliteDAO();
    }

}