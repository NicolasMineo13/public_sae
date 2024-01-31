import mysql from "mysql2/promise";

let dbInstance = null;
let dbInstancePromise = null;

export async function getDatabaseInstance() {
    if (dbInstancePromise === null) {
        dbInstancePromise = (async () => {
            try {
                dbInstance = await mysql.createConnection({
                    host: "mn606466-001.eu.clouddb.ovh.net",
                    port: 35151,
                    user: "nicolas",
                    password: "Julien13",
                    database: "sae_bdd",
                });
                await dbInstance.connect();
                console.log('Connecté à la base de données MariaDB');
                return dbInstance;
            } catch (err) {
                console.error('Erreur de connexion à la base de données :', err);
                throw err;
            }
        })();
    }

    return dbInstancePromise;
}