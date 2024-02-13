import ReponsesService from "../services/reponsesService.js";
import { Reponse } from "../models/reponse.js";

const ReponsesController = {
    getReponses: async (req, res) => {
        const { id, libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution } = req.query;
        let conditions = {};

        if (id) {
            conditions.id = id;
        }

        if (libelle) {
            conditions.libelle = libelle;
        }

        if (date_creation) {
            conditions.date_creation = date_creation;
        }

        if (date_derniere_modif) {
            conditions.date_derniere_modif = date_derniere_modif;
        }

        if (id_utilisateur) {
            conditions.id_utilisateur = id_utilisateur;
        }

        if (id_ticket) {
            conditions.id_ticket = id_ticket;
        }

        if (solution) {
            conditions.solution = solution;
        }

        try {
            const reponses = await ReponsesService.getReponses(
                conditions
            );

            const reponsesObject = reponses.map(reponse => new Reponse(
                reponse.id,
                reponse.libelle,
                reponse.date_creation,
                reponse.date_derniere_modif,
                reponse.id_utilisateur,
                reponse.id_ticket,
                reponse.solution,
            ));

            res.json({ reponses: reponsesObject });
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la récupération des reponses",
                errorMsg: error.message,
            });
        }
    },

    createReponse: async (req, res) => {
        const { libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution } = req.query;

        try {
            const newReponse = await ReponsesService.createReponse(
                libelle,
                date_creation,
                date_derniere_modif,
                id_utilisateur,
                id_ticket,
                solution,
            );

            if (newReponse instanceof Error) {
                res.json({ status: false, error: newReponse.message });
            } else {
                res.json({ status: true });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la création du reponse",
                errorMsg: error.message,
            });
        }
    },

    updateReponse: async (req, res) => {
        const { id } = req.params;
        const updatedFields = req.query;

        if (!id) {
            res.status(400).json({
                error: "L'id du reponse est requis.",
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
            const reponse = await ReponsesService.updateReponse(
                id,
                updatedFields
            );
            if (reponse) {
                res.json({ status: true, message: "Reponse mis à jour avec succès." });
            } else {
                res.status(404).json({ error: "Reponse non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la mise à jour du reponse",
                errorMsg: error.message,
            });
        }
    },

    deleteReponse: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: "L'id du reponse est requis.",
            });
            return;
        }

        try {
            const reponse = await ReponsesService.deleteReponse(id);
            if (reponse) {
                res.json({ status: true, message: "Reponse supprimé avec succès." });
            } else {
                res.status(404).json({ error: "Reponse non trouvé." });
            }
        } catch (error) {
            res.status(500).json({
                error: "Erreur lors de la suppression du reponse",
                errorMsg: error.message,
            });
        }
    },
}

export default ReponsesController;