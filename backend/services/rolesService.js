import { DAOMysqlFactory } from "../factory/DAOMysqlFactory.js";

const mysqlFactory = new DAOMysqlFactory();
const rolesDAO = mysqlFactory.createRolesDAO();

const RolesService = {
    getRoles: async (conditions) => {
        return await rolesDAO.getRoles(conditions);
    },

    createRole: async (libelle) => {
        return await rolesDAO.createRole(libelle);
    },

    updateRole: async (id, updatedFields) => {
        return await rolesDAO.updateRole(id, updatedFields);
    },

    deleteRole: async (id) => {
        return await rolesDAO.deleteRole(id);
    },
};

export default RolesService;