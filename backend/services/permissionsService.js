import { DAOMysqlFactory } from "../factory/DAOMysqlFactory.js";

const mysqlFactory = new DAOMysqlFactory();
const permissionsDAO = mysqlFactory.createPermissionsDAO();

const PermissionsService = {
    getPermissions: async (conditions) => {
        return await permissionsDAO.getPermissions(conditions);
    },

    createPermission: async (libelle) => {
        return await permissionsDAO.createPermission(libelle);
    },

    updatePermission: async (id, updatedFields) => {
        return await permissionsDAO.updatePermission(id, updatedFields);
    },

    deletePermission: async (id) => {
        return await permissionsDAO.deletePermission(id);
    },
};

export default PermissionsService;