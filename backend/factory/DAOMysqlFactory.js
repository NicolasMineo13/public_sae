import { DAOFactory } from "./DAOFactory.js";
import { UtilisateursMysqlDAO } from "../dao/utilisateursMysqlDAO.js";
import { TicketsMysqlDAO } from "../dao/ticketsMysqlDAO.js";
import { RolesMysqlDAO } from "../dao/rolesMysqlDAO.js";
import { PermissionsMysqlDAO } from "../dao/permissionsMysqlDAO.js";
import { StatutsMysqlDAO } from "../dao/statutsMysqlDAO.js";

export class DAOMysqlFactory extends DAOFactory {
    constructor() {
        super(); // Appel du constructeur de la classe parente
    }

    createUtilisateursDAO() {
        return new UtilisateursMysqlDAO();
    }

    createTicketsDAO() {
        return new TicketsMysqlDAO();
    }

    createRolesDAO() {
        return new RolesMysqlDAO();
    }

    createPermissionsDAO() {
        return new PermissionsMysqlDAO();
    }

    createStatutsDAO() {
        return new StatutsMysqlDAO();
    }
}