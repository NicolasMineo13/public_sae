import RolesService from "../services/rolesService.js";
import { Role } from "../models/role.js";

const RolesController = {
    getRoles: async (req, res) => {
        const { id, libelle } = req.query;
        let conditions = {};

        if (id) {
            conditions.id = id;
        }

        if (libelle) {
            conditions.libelle = libelle;
        }

        try {
            const roles = await RolesService.getRoles(
                conditions
            );

            const rolesObject = roles.map(role => new Role(
                role.id,
                role.libelle
            ));

            res.json({ roles: rolesObject });
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la récupération des roles",
                errorMsg: error.message,
            });
        }
    },

    createRole: async (req, res) => {
        const { libelle } = req.query;

        try {
            const newRole = await RolesService.createRole(
                libelle
            );

            if (newRole instanceof Error) {
                res.json({ status: false, error: newRole.message });
            } else {
                res.json({ status: true });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la création du role",
                errorMsg: error.message,
            });
        }
    },

    updateRole: async (req, res) => {
        const { id } = req.params;
        const updatedFields = req.query;

        if (!id) {
            res.status(400).json({
                error: "L'id du role est requis.",
            });
            return;
        }

        // Si pas de champs à mettre à jour
        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({
                error: "Aucun champ à mettre à jour.",
            });
            return;
        }

        try {
            const role = await RolesService.updateRole(
                id,
                updatedFields
            );
            if (role) {
                res.json({ status: true, message: "Role mis à jour avec succès." });
            } else {
                res.status(404).json({ error: "Role non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la mise à jour du role",
                errorMsg: error.message,
            });
        }
    },

    deleteRole: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: "L'id du role est requis.",
            });
            return;
        }

        try {
            const role = await RolesService.deleteRole(id);
            if (role) {
                res.json({ status: true, message: "Role supprimé avec succès." });
            } else {
                res.status(404).json({ error: "Role non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la suppression du role",
                errorMsg: error.message,
            });
        }
    },
}

export default RolesController;