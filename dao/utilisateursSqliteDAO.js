import { UtilisateursDAO } from "./utilisateursDAO.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export class UtilisateursSqliteDAO extends UtilisateursDAO {
    constructor() {
        super();
        this.dbPromise = open({
            filename: "./database/database.db",
            driver: sqlite3.Database,
        });
    }

    async loginUtilisateur(login, password) {
        const db = await this.dbPromise;

        const utilisateur = await db.get(
            "SELECT * FROM utilisateurs WHERE login = ?",
            login
        );

        if (!utilisateur) {
            throw new Error("Identifiants incorrects !");
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            utilisateur.password
        );

        if (!isPasswordCorrect) {
            throw new Error("Identifiants incorrects !");
        }

        const oldtoken = utilisateur.token;
        const oldRefreshToken = utilisateur.refreshtoken;

        dotenv.config({ path: "./secretKey.env" });

        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: utilisateur.id, login: utilisateur.login }, secretKey, { expiresIn: "15m" });
        const secretRefreshTokenKey = process.env.REFRESH_TOKEN_SECRET;
        const refreshToken = jwt.sign({ userId: utilisateur.id, login: utilisateur.login }, secretRefreshTokenKey, { expiresIn: "7d" });

        const addToken = await db.run("UPDATE utilisateurs SET token = ? WHERE id = ?", token, utilisateur.id);
        const addRefreshToken = await db.run("UPDATE utilisateurs SET refreshToken = ? WHERE id = ?", refreshToken, utilisateur.id);

        if (oldtoken) {
            const insertResult = await db.run("INSERT INTO tokensblacklist (token) VALUES (?)", oldtoken);
            if (insertResult.changes < 1) {
                throw new Error("Problème d'insertion du token dans la blacklist");
            }
        }

        if (oldRefreshToken) {
            const insertResult = await db.run("INSERT INTO tokensblacklist (token) VALUES (?)", oldRefreshToken);
            if (insertResult.changes < 1) {
                throw new Error("Problème d'insertion du refreshToken dans la blacklist");
            }
        }

        if (addToken.changes < 1) {
            throw new Error("Problème d'ajout du token");
        }

        if (addRefreshToken.changes < 1) {
            throw new Error("Problème d'ajout du refreshToken");
        }

        return { status: true, token: token, refreshToken: refreshToken, id: utilisateur.id };
    }

    async getUtilisateurs(filter) {
        const db = await this.dbPromise;
        const conditions = [];
        const params = [];

        try {
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
                conditions.push("id_role = ?");
                params.push(filter.id_role);
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

            return await db.all(query, params);
        } catch (error) {
            // Gérer les erreurs (journalisation, rejet, etc.)
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            throw error;
        }
    }

    async createUtilisateur(nom, prenom, email, password, id_role) {
        const db = await this.dbPromise;

        if (!nom || !prenom || !email || !password || !id_role) {
            throw new Error("Paramètres manquants");
        }


        // Vérifier si le mail est valide
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            throw new Error("Email invalide");
        }

        const login = nom.toUpperCase() + prenom[0].toUpperCase();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const emailExist = await db.get(
            "SELECT id FROM utilisateurs WHERE email = ?",
            email
        );

        const utilisateur = await db.get(
            "SELECT id FROM utilisateurs WHERE login = ?",
            login
        );

        if (emailExist) {
            return new Error("Un compte existe déjà avec cet email !");
        }

        if (utilisateur) {
            return new Error("Un compte existe déjà avec ce login!");
        }

        console.log(nom, prenom, email, login, hashedPassword, id_role);

        return db.run(
            "INSERT INTO utilisateurs (nom, prenom, email, login, password, id_role) VALUES (?, ?, ?, ?, ?, ?)",
            nom,
            prenom,
            email,
            login,
            hashedPassword,
            id_role
        );
    }
}