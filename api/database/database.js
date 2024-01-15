import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Création de la base de données
export async function openDb() {
    return open({
        filename: "./database/database.db",
        driver: sqlite3.Database,
    });
}

// Création de la table "utilisateurs" qui a pour colonnes : id, nom, prenom, email, login, password, role, token, refreshToken

export async function createUsersTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS utilisateurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT,
            prenom TEXT,
            email TEXT,
            login TEXT,
            password TEXT,
            id_role INTEGER,
            token TEXT,
            refreshToken TEXT,
            FOREIGN KEY (id_role) REFERENCES roles(id)
        )
    `);
}

// Création de la table "tickets" qui a pour colonnes : id, titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture

export async function createTicketsTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT,
            description TEXT,
            date_creation DATE,
            id_utilisateur_demandeur INTEGER,
            id_utilisateur_technicien INTEGER,
            id_statut INTEGER,
            date_derniere_modif DATE,
            date_cloture DATE,
            FOREIGN KEY (id_utilisateur_demandeur) REFERENCES utilisateurs(id),
            FOREIGN KEY (id_utilisateur_technicien) REFERENCES utilisateurs(id),
            FOREIGN KEY (id_statut) REFERENCES statuts(id)
        )
    `);
}

// Création de la table "statuts" qui a pour colonnes : id, statut

export async function createStatutsTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS statuts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libelle TEXT
        )
    `);
}

// Création de la table "reponses" qui a pour colonnes : id, commentaire, date_creation, date_derniere_modif, id_utilisateur, id_ticket

export async function createReponsesTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS reponses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libelle TEXT,
            date_creation DATE,
            date_derniere_modif DATE,
            id_utilisateur INTEGER,
            id_ticket INTEGER,
            FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id),
            FOREIGN KEY (id_ticket) REFERENCES tickets(id)
        )
    `);
}

// Création de la table "roles" qui a pour colonnes : id, libelle

export async function createRolesTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libelle TEXT
        )
    `);
}

// Création de la table "permissions" qui a pour colonnes : id, libelle

export async function createPermissionsTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS permissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libelle TEXT
        )
    `);
}

// Création de la table "roles_permissions" qui a pour colonnes : id, id_role, id_permission

export async function createRolesPermissionsTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS roles_permissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_role INTEGER,
            id_permission INTEGER,
            FOREIGN KEY (id_role) REFERENCES roles(id),
            FOREIGN KEY (id_permission) REFERENCES permissions(id)
        )
    `);
}

// Création de la table "tokensblacklist" qui a pour colonnes : token

export async function createTokensBlacklistTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tokensblacklist (
            token TEXT
        )
    `);
}

// Création de la base et des tables

export async function createTables() {
    const db = await openDb();
    await createUsersTable(db);
    await createTicketsTable(db);
    await createStatutsTable(db);
    await createReponsesTable(db);
    await createRolesTable(db);
    await createPermissionsTable(db);
    await createRolesPermissionsTable(db);
    await createTokensBlacklistTable(db);
    await db.close();
}

// Exécution

createTables();