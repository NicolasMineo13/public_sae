import PermissionsService from "../services/permissionsService.js";
import { Permission } from "../models/permission.js";

const PermissionsController = {
    getPermissions: async (req, res) => {
        const { id, libelle } = req.query;
        let conditions = {};

        if (id) {
            conditions.id = id;
        }

        if (libelle) {
            conditions.libelle = libelle;
        }

        try {
            const permissions = await PermissionsService.getPermissions(
                conditions
            );

            const permissionsObject = permissions.map(permission => new Permission(
                permission.id,
                permission.libelle
            ));

            res.json({ permissions: permissionsObject });
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la récupération des permissions",
                errorMsg: error.message,
            });
        }
    },

    createPermission: async (req, res) => {
        const { libelle } = req.query;

        try {
            const newPermission = await PermissionsService.createPermission(
                libelle
            );

            if (newPermission instanceof Error) {
                res.json({ status: false, error: newPermission.message });
            } else {
                res.json({ status: true });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la création du permission",
                errorMsg: error.message,
            });
        }
    },

    updatePermission: async (req, res) => {
        const { id } = req.params;
        const updatedFields = req.query;

        if (!id) {
            res.status(400).json({
                error: "L'id du permission est requis.",
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
            const permission = await PermissionsService.updatePermission(
                id,
                updatedFields
            );
            if (permission) {
                res.json({ status: true, message: "Permission mis à jour avec succès." });
            } else {
                res.status(404).json({ error: "Permission non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la mise à jour du permission",
                errorMsg: error.message,
            });
        }
    },

    deletePermission: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: "L'id du permission est requis.",
            });
            return;
        }

        try {
            const permission = await PermissionsService.deletePermission(id);
            if (permission) {
                res.json({ status: true, message: "Permission supprimé avec succès." });
            } else {
                res.status(404).json({ error: "Permission non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la suppression du permission",
                errorMsg: error.message,
            });
        }
    },
}

export default PermissionsController;