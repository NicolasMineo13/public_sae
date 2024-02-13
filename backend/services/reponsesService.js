import { DAOMysqlFactory } from "../factory/DAOMysqlFactory.js";

const mysqlFactory = new DAOMysqlFactory();
const reponsesDAO = mysqlFactory.createReponsesDAO();

const ReponsesService = {
    getReponses: async (conditions) => {
        return await reponsesDAO.getReponses(conditions);
    },

    createReponse: async (libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution) => {
        return await reponsesDAO.createReponse(libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution);
    },

    updateReponse: async (id, updatedFields) => {
        return await reponsesDAO.updateReponse(id, updatedFields);
    },

    deleteReponse: async (id) => {
        return await reponsesDAO.deleteReponse(id);
    },
};

export default ReponsesService;