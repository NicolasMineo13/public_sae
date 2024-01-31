import StatutsService from "../services/statutsService.js";
import { Statut } from "../models/statut.js";

const StatutsController = {
    getStatuts: async (req, res) => {
        const { id, libelle } = req.query;
        let conditions = {};

        if (id) {
            conditions.id = id;
        }

        if (libelle) {
            conditions.libelle = libelle;
        }

        try {
            const statuts = await StatutsService.getStatuts(
                conditions
            );

            const statutsObject = statuts.map(statut => new Statut(
                statut.id,
                statut.libelle
            ));

            res.json({ statuts: statutsObject });
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la récupération des statuts",
                errorMsg: error.message,
            });
        }
    },

    createStatut: async (req, res) => {
        const { libelle } = req.query;

        try {
            const newStatut = await StatutsService.createStatut(
                libelle
            );

            if (newStatut instanceof Error) {
                res.json({ status: false, error: newStatut.message });
            } else {
                res.json({ status: true });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la création du statut",
                errorMsg: error.message,
            });
        }
    },

    updateStatut: async (req, res) => {
        const { id } = req.params;
        const updatedFields = req.query;

        if (!id) {
            res.status(400).json({
                error: "L'id du statut est requis.",
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
            const statut = await StatutsService.updateStatut(
                id,
                updatedFields
            );
            if (statut) {
                res.json({ status: true, message: "Statut mis à jour avec succès." });
            } else {
                res.status(404).json({ error: "Statut non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la mise à jour du statut",
                errorMsg: error.message,
            });
        }
    },

    deleteStatut: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: "L'id du statut est requis.",
            });
            return;
        }

        try {
            const statut = await StatutsService.deleteStatut(id);
            if (statut) {
                res.json({ status: true, message: "Statut supprimé avec succès." });
            } else {
                res.status(404).json({ error: "Statut non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la suppression du statut",
                errorMsg: error.message,
            });
        }
    },
}

export default StatutsController;