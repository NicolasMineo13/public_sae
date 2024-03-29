import UtilisateursService from "../services/utilisateursService.js";
import { Utilisateur } from "../models/utilisateur.js";

const UtilisateursController = {

	loginUtilisateur: async (req, res) => {
		const { login, password } = req.query;
		try {
			const utilisateur = await UtilisateursService.loginUtilisateur(
				login,
				password
			);
			if (utilisateur) {
				res.json({ status: true, token: utilisateur.token, refreshtoken: utilisateur.refreshToken, id: utilisateur.id });
			} else {
				res.json({ status: false });
			}
		} catch (error) {
			res.status(500).json({
				error: "Erreur lors de la connexion de l'utilisateur",
				errorMsg: error.message,
			});
		}
	},

	logoutUtilisateur: async (req, res) => {
		const { id } = req.params;
		const token = req.headers.authorization;
		const refreshToken = req.headers["refresh-token"];

		try {
			const logout = await UtilisateursService.logoutUtilisateur(id, token, refreshToken);
			if (logout.status === true) {
				res.json({ status: true, message: "Utilisateur déconnecté avec succès." });
			} else {
				res.status(404).json({ error: "Déconnexion impossible." });
			}
		} catch (error) {
			res.status(500).json({
				error: "Erreur lors de la déconnexion de l'utilisateur",
				errorMsg: error.message,
			});
		}
	},

	getUtilisateurs: async (req, res) => {
		const { id, nom, prenom, email, login, password, id_role, token, refreshToken } = req.query;
		let conditions = {};

		if (id) {
			conditions.id = id;
		}

		if (nom) {
			conditions.nom = nom;
		}

		if (prenom) {
			conditions.prenom = prenom;
		}

		if (email) {
			conditions.email = email;
		}

		if (login) {
			conditions.login = login;
		}

		if (password) {
			conditions.password = password;
		}

		if (id_role) {
			conditions.id_role = id_role;
		}

		if (token) {
			conditions.token = token;
		}

		if (refreshToken) {
			conditions.refreshToken = refreshToken;
		}

		try {
			const utilisateurs = await UtilisateursService.getUtilisateurs(
				conditions
			);

			const utilisateursObject = utilisateurs.map(user => new Utilisateur(
				user.id,
				user.nom,
				user.prenom,
				user.email,
				user.login,
				user.password,
				user.id_role,
				user.token,
				user.refreshToken
			));

			res.json({ utilisateurs: utilisateursObject });
		} catch (error) {
			res.status(500).json({
				error: "Erreur lors de la récupération des utilisateurs",
				errorMsg: error.message,
			});
		}
	},

	createUtilisateur: async (req, res) => {
		const { nom, prenom, email, password, id_role } = req.query;

		try {
			const newUtilisateur = await UtilisateursService.createUtilisateur(
				nom,
				prenom,
				email,
				password,
				id_role
			);

			if (newUtilisateur instanceof Error) {
				res.json({ status: false, error: newUtilisateur.message });
			} else {
				res.json({ status: true });
			}
		} catch (error) {
			res.status(500).json({
				error: "Erreur lors de la création de l'utilisateur",
				errorMsg: error.message,
			});
		}
	},

	updateUtilisateur: async (req, res) => {
		const { id } = req.params;
		const updatedFields = req.query;

		if (!id) {
			res.status(400).json({
				error: "L'id de l'utilisateur est requis.",
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
			const utilisateur = await UtilisateursService.updateUtilisateur(
				id,
				updatedFields
			);
			if (utilisateur) {
				res.json({ status: true, message: "Utilisateur mis à jour avec succès." });
			} else {
				res.status(404).json({ error: "Utilisateur non trouvé." });
			}
		} catch (error) {
			res.status(500).json({
				error: "Erreur lors de la mise à jour de l'utilisateur",
				errorMsg: error.message,
			});
		}
	},

	deleteUtilisateur: async (req, res) => {
		const { id } = req.params;

		if (!id) {
			res.status(400).json({
				error: "L'id de l'utilisateur est requis.",
			});
			return;
		}

		try {
			const utilisateur = await UtilisateursService.deleteUtilisateur(id);
			if (utilisateur) {
				res.json({ status: true, message: "Utilisateur supprimé avec succès." });
			} else {
				res.status(404).json({ error: "Utilisateur non trouvé." });
			}
		} catch (error) {
			res.status(500).json({
				error: "Erreur lors de la suppression de l'utilisateur",
				errorMsg: error.message,
			});
		}
	},
}

export default UtilisateursController;