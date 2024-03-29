import { UtilisateursDAO } from "./utilisateursDAO.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDatabasePool } from "../db.js";

export class UtilisateursMysqlDAO extends UtilisateursDAO {
	constructor() {
		super();
		this.pool = getDatabasePool();
	}

	async loginUtilisateur(login, password) {
		try {
			const pool = await this.pool;
			const db = await pool.getConnection();

			const [rows] = await db.query(
				"SELECT * FROM utilisateurs WHERE login = ?",
				login
			);

			if (!rows || rows.length === 0) {
				db.release();
				throw new Error("Identifiants incorrects !");
			}

			const utilisateur = rows[0];

			const isPasswordCorrect = await bcrypt.compare(
				password,
				utilisateur.password
			);

			if (!isPasswordCorrect) {
				db.release();
				throw new Error("Identifiants incorrects !");
			}

			const oldtoken = utilisateur.token;
			const oldRefreshToken = utilisateur.refreshToken;

			const secretKey = process.env.JWT_SECRET_KEY;
			const token = jwt.sign({ userId: utilisateur.id, login: utilisateur.login }, secretKey, { expiresIn: "1d" });
			const secretRefreshTokenKey = process.env.REFRESH_TOKEN_SECRET;
			const refreshToken = jwt.sign({ userId: utilisateur.id, login: utilisateur.login }, secretRefreshTokenKey, { expiresIn: "7d" });

			const [updateTokenResult] = await db.execute("UPDATE utilisateurs SET token = ? WHERE id = ?", [token, utilisateur.id]);
			const [updateRefreshTokenResult] = await db.execute("UPDATE utilisateurs SET refreshToken = ? WHERE id = ?", [refreshToken, utilisateur.id]);

			if (oldtoken) {
				const [insertResult] = await db.execute("INSERT INTO tokensblacklist (token) VALUES (?)", [oldtoken]);
				if (insertResult.affectedRows < 1) {
					throw new Error("Problème d'insertion du token dans la blacklist");
				}
			}

			if (oldRefreshToken) {
				const [insertRefreshResult] = await db.execute("INSERT INTO tokensblacklist (token) VALUES (?)", [oldRefreshToken]);
				if (insertRefreshResult.affectedRows < 1) {
					throw new Error("Problème d'insertion du refreshToken dans la blacklist");
				}
			}

			if (updateTokenResult.affectedRows < 1) {
				throw new Error("Problème d'ajout du token");
			}

			if (updateRefreshTokenResult.affectedRows < 1) {
				throw new Error("Problème d'ajout du refreshToken");
			}

			db.release();
			return { status: true, token: token, refreshToken: refreshToken, id: utilisateur.id };
		}
		catch (error) {
			console.error("Erreur lors de la connexion :", error);
			throw error;
		}
	}

	async logoutUtilisateur(id, token, refreshToken) {
		try {
			const pool = await this.pool;
			const db = await pool.getConnection();

			const [response] = await db.execute(
				"SELECT token, refreshToken FROM utilisateurs WHERE id = ?",
				[id]
			);

			if (response && response.length > 0) {
				const userToken = response[0].token;
				const userRefreshToken = response[0].refreshToken;

				if (userToken !== token || userRefreshToken !== refreshToken) {
					db.release();
					return { status: false, error: "Token invalide" };
				}

				if (!userToken) {
					db.release();
					return { status: false, error: "Utilisateur non connecté !" };
				}

				const [updateResult] = await db.execute("UPDATE utilisateurs SET token = NULL, refreshToken = NULL WHERE id = ?", [id]);

				if (updateResult && updateResult.affectedRows > 0) {
					const [insertResult] = await db.execute("INSERT INTO tokensblacklist (token) VALUES (?)", [userToken]);
					const [insertResultRefresh] = await db.execute("INSERT INTO tokensblacklist (token) VALUES (?)", [userRefreshToken]);

					if (insertResult && insertResult.affectedRows > 0 && insertResultRefresh && insertResultRefresh.affectedRows > 0) {
						db.release();
						return { status: true, message: "Utilisateur déconnecté avec succès." };
					} else {
						db.release();
						return { status: false, error: "Problème insert" };
					}
				} else {
					db.release();
					return { status: false, error: "Problème update" }
				}
			} else {
				db.release();
				return { status: false, error: "Utilisateur non trouvé" };
			}
		}
		catch (error) {
			console.error("Erreur lors de la déconnexion :", error);
			throw error;
		}
	}

	async getUtilisateurs(filter) {
		try {
			const pool = await this.pool;
			const db = await pool.getConnection();
			const conditions = [];
			const params = [];

			// Construisez les conditions en fonction des filtres
			if (filter.id) {
				conditions.push("id = ?");
				params.push(filter.id);
			}

			if (filter.nom) {
				conditions.push("nom = ?");
				params.push(filter.nom);
			}

			if (filter.prenom) {
				conditions.push("prenom = ?");
				params.push(filter.prenom);
			}

			if (filter.email) {
				conditions.push("email = ?");
				params.push(filter.email);
			}

			if (filter.login) {
				conditions.push("login = ?");
				params.push(filter.login);
			}

			if (filter.password) {
				conditions.push("password = ?");
				params.push(filter.password);
			}

			if (filter.id_role) {
				if (!isNaN(parseInt(filter.id_role, 10))) {
					conditions.push("id_role = ?");
					params.push(filter.id_role);
				} else {
					// Recherche d'ID d'utilisateur par libellé
					const searchTerm = `%${filter.id_role}%`;
					const [result] = await db.execute(
						"SELECT id FROM roles WHERE libelle LIKE ?",
						[searchTerm]
					);
					if (result && result.length > 0) {
						conditions.push("id_role = ?");
						params.push(result[0].id);
					}
				}
			}

			if (filter.token) {
				conditions.push("token = ?");
				params.push(filter.token);
			}

			if (filter.refreshToken) {
				conditions.push("refreshToken = ?");
				params.push(filter.refreshToken);
			}

			// Construisez la requête
			let query = "SELECT * FROM utilisateurs";
			if (conditions.length > 0) {
				query += " WHERE " + conditions.join(" AND ");
			}

			const [results] = await db.execute(query, params);
			db.release();
			return results;
		} catch (error) {
			// Gérer les erreurs (journalisation, rejet, etc.)
			console.error("Erreur lors de la récupération des utilisateurs :", error);
			throw error;
		}
	}

	async createUtilisateur(nom, prenom, email, password, id_role) {
		try {
			const pool = await this.pool;
			const db = await pool.getConnection();

			if (!nom || !prenom || !email || !password || !id_role) {
				db.release();
				throw new Error("Paramètres manquants");
			}

			// Vérifier si le mail est valide
			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!regex.test(email)) {
				db.release();
				throw new Error("Email invalide");
			}

			let login = nom.toUpperCase() + prenom[0].toUpperCase();

			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const [emailExist] = await db.execute(
				"SELECT id FROM utilisateurs WHERE email = ?",
				[email]
			);

			let [utilisateur] = await db.execute(
				"SELECT id FROM utilisateurs WHERE login = ?",
				[login]
			);

			if (emailExist.length > 0) {
				db.release();
				return new Error("Un compte existe déjà avec cet email !");
			}

			let cpt = 0;
			let newLogin = login;

			if (utilisateur.length > 0) {
				do {
					newLogin = login + cpt;
					[utilisateur] = await db.execute(
						"SELECT id FROM utilisateurs WHERE login = ?",
						[newLogin]
					);
					cpt++;
				} while (utilisateur.length > 0);
			}

			login = newLogin;

			const [result] = await db.execute(
				"INSERT INTO utilisateurs (nom, prenom, email, login, password, id_role) VALUES (?, ?, ?, ?, ?, ?)",
				[nom, prenom, email, login, hashedPassword, id_role]
			);

			db.release();
			return result.insertId; // Retourne l'ID de l'utilisateur créé.
		}
		catch (error) {
			console.error("Erreur lors de la création d'un utilisateur :", error);
			throw error;
		}
	}

	async updateUtilisateur(id, updatedFields) {
		try {
			const pool = await this.pool;
			const db = await pool.getConnection();

			const { nom, prenom, email, login, password, id_role } = updatedFields;

			let query = "UPDATE utilisateurs SET";
			const params = [];

			if (nom) {
				query += " nom = ?,";
				params.push(nom);
			}

			if (prenom) {
				query += " prenom = ?,";
				params.push(prenom);
			}

			if (email) {
				query += " email = ?,";
				params.push(email);
			}

			if (login) {
				query += " login = ?,";
				params.push(login);
			}

			if (password) {
				query += " password = ?,";
				const saltRounds = 10;
				const hashedPassword = await bcrypt.hash(password, saltRounds);
				params.push(hashedPassword);
			}

			if (id_role) {
				query += " id_role = ?,";
				params.push(id_role);
			}

			query = query.slice(0, -1);
			query += " WHERE id = ?";
			params.push(id);

			const [result] = await db.execute(query, params);

			if (result && result.affectedRows > 0) {
				db.release();
				return true; // Mise à jour réussie
			} else {
				db.release();
				return false; // Aucun utilisateur mis à jour (id non trouvé)
			}
		}
		catch (error) {
			console.error("Erreur lors de la mise à jour d'un utilisateur :", error);
			throw error;
		}
	}

	async deleteUtilisateur(id) {
		try {
			const pool = await this.pool;
			const db = await pool.getConnection();
			const [result] = await db.execute("DELETE FROM utilisateurs WHERE id = ?", [id]);
			if (result && result.affectedRows > 0) {
				db.release();
				return true; // Suppression réussie
			} else {
				db.release();
				return false; // Aucun utilisateur supprimé (id non trouvé)
			}
		}
		catch (error) {
			console.error("Erreur lors de la suppression d'un utilisateur :", error);
			throw error;
		}
	}
}