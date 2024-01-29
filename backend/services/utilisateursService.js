import { DAOSqliteFactory } from "../factory/DAOSqliteFactory.js";

const sqliteFactory = new DAOSqliteFactory();
const utilisateursDAO = sqliteFactory.createUtilisateursDAO();

const UtilisateursService = {
    getUtilisateurs: async (conditions) => {
        return await utilisateursDAO.getUtilisateurs(conditions);
    },

    createUtilisateur: async (nom, prenom, email, password, id_role) => {
        return await utilisateursDAO.createUtilisateur(nom, prenom, email, password, id_role);
    },

    loginUtilisateur: async (login, password) => {
        return await utilisateursDAO.loginUtilisateur(login, password);
    },

    logoutUtilisateur: async (id, token, refreshToken) => {
        return await utilisateursDAO.logoutUtilisateur(id, token, refreshToken);
    },

    updateUtilisateur: async (id, updatedFields) => {
        return await utilisateursDAO.updateUtilisateur(id, updatedFields);
    },

    deleteUtilisateur: async (id) => {
        return await utilisateursDAO.deleteUtilisateur(id);
    },
};

export default UtilisateursService;