import { DAOFactory } from "./DAOFactory.js";
import { UtilisateursSqliteDAO } from "../dao/utilisateursSqliteDAO.js";

export class DAOSqliteFactory extends DAOFactory {
    constructor() {
        super(); // Appel du constructeur de la classe parente
    }

    createUtilisateursDAO() {
        return new UtilisateursSqliteDAO();
    }
}