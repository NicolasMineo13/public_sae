import { DAOMysqlFactory } from "../factory/DAOMysqlFactory.js";

const mysqlFactory = new DAOMysqlFactory();
const statutsDAO = mysqlFactory.createStatutsDAO();

const StatutsService = {
    getStatuts: async (conditions) => {
        return await statutsDAO.getStatuts(conditions);
    },

    createStatut: async (libelle, couleur) => {
        return await statutsDAO.createStatut(libelle, couleur);
    },

    updateStatut: async (id, updatedFields) => {
        return await statutsDAO.updateStatut(id, updatedFields);
    },

    deleteStatut: async (id) => {
        return await statutsDAO.deleteStatut(id);
    },
};

export default StatutsService;