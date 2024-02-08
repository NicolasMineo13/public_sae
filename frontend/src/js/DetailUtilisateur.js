import React, { useState, useEffect } from "react";
import "../scss/app.scss";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import home from '../assets/icons/home.svg';
import back from '../assets/icons/back.svg';
import API_BASE_URL from './config';

function DetailUtilisateur() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');

    const [update_nom, update_setNom] = useState('');
    const [update_prenom, update_setPrenom] = useState('');
    const [update_email, update_setEmail] = useState('');
    const [update_login, update_setLogin] = useState('');
    const [update_role, update_setRole] = useState('');
    const [update_password, update_setPassword] = useState('');

    const [roles, setRoles] = useState([]); // State to store the list of roles

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchRoles();
        fetchUtilisateur();
    }, []);

    const { id } = useParams();

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Créez un objet pour stocker les valeurs modifiées
        const updatedFields = {};

        // Comparez chaque champ avec sa valeur d'origine et ajoutez-le à l'objet de mise à jour s'il a été modifié
        if (nom !== update_nom) {
            updatedFields.nom = update_nom;
        }
        if (prenom !== update_prenom) {
            updatedFields.prenom = update_prenom;
        }
        if (email !== update_email) {
            updatedFields.email = update_email;
        }
        if (login !== update_login) {
            updatedFields.login = update_login;
        }
        if (role !== update_role) {
            updatedFields.id_role = update_role;
        }
        if (password !== update_password) {
            updatedFields.password = update_password;
        }

        // Vérifiez s'il y a des champs modifiés
        if (Object.keys(updatedFields).length > 0) {
            // Au moins un champ a été modifié, vous pouvez effectuer la mise à jour ici
            // Créez les paramètres de requête en utilisant URLSearchParams
            const queryParams = new URLSearchParams(updatedFields);

            // Ajoutez les paramètres de requête à l'URL
            const patchUrl = `${API_BASE_URL}/utilisateurs/${id}?${queryParams.toString()}`;

            // Obtenez le jeton d'accès et le jeton de rafraîchissement du stockage local
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            // Exemple d'envoi de la requête PATCH (vous devrez adapter cela à votre API)
            const response = await fetch(patchUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            // Si la mise à jour réussit, redirigez l'utilisateur
            if (response.ok) {
                navigate('/utilisateurs');
            } else {
                // Gérez les erreurs de la requête ici
                console.error('Erreur lors de la mise à jour de l\'utilisateur');
            }
        } else {
            // Aucun champ n'a été modifié, vous pouvez afficher un message ou ignorer la mise à jour
            console.log("Aucune modification n'a été apportée à l\'utilisateur.");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshtoken');
        const url = `${API_BASE_URL}/utilisateurs/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'Refresh-Token': refreshToken,
            },
        });

        // Si la suppression réussit, redirigez l'utilisateur
        if (response.ok) {
            navigate('/utilisateurs');
        } else {
            // Gérez les erreurs de la requête ici
            console.error('Erreur lors de la suppression de l\'utilisateur');
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = API_BASE_URL + "/roles";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching users");
            }

            const data = await response.json();
            if (Array.isArray(data.roles)) {
                // Set the list of users in the state
                setRoles(data.roles);
            } else {
                console.error("API response does not contain user information:", data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchUtilisateur = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = API_BASE_URL + "/utilisateurs?id=" + id;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching users");
            }

            const data = await response.json();
            if (Array.isArray(data.utilisateurs) && data.utilisateurs.length > 0) {
                const UtilisateurData = data.utilisateurs[0];
                UtilisateurData._password = "";
                setNom(UtilisateurData._nom);
                setPrenom(UtilisateurData._prenom);
                setEmail(UtilisateurData._email);
                setLogin(UtilisateurData._login);
                setRole(UtilisateurData._role);
                setPassword(UtilisateurData._password);
                // Séparation des données de mise à jour
                update_setNom(UtilisateurData._nom);
                update_setPrenom(UtilisateurData._prenom);
                update_setEmail(UtilisateurData._email);
                update_setLogin(UtilisateurData._login);
                update_setRole(UtilisateurData._role);
                update_setPassword(UtilisateurData._password);
            } else {
                console.error(
                    "API response does not contain user information:",
                    data
                );
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <div className="container-page">
            <Header />
            <div className="detail-utilisateur__container-page">
                <div className="top__header-page">
                    <a href="/utilisateurs">
                        <img className='back__button' src={back} />
                    </a>
                    <h1>Affichage de l'utilisateur N°{id} - {update_login}</h1>
                    <a className='m__initial' href="/home">
                        <img className='home__button' src={home} />
                    </a>
                </div>
                <div className="form-container">
                    <form onSubmit={handleUpdate}>
                        <div className="input-group">
                            <label htmlFor="nom">Nom :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="nom"
                                value={update_nom}
                                onChange={(e) => update_setNom(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="prenom">Prénom :</label>
                            <input
                                className="input__text"
                                id="prenom"
                                value={update_prenom}
                                onChange={(e) => update_setPrenom(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">E-mail :</label>
                            <input
                                className="input__text"
                                type="email"
                                id="email"
                                value={update_email}
                                onChange={(e) => update_setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="text">Login :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="login"
                                value={update_login}
                                onChange={(e) => update_setLogin(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="role">Rôle :</label>
                            <select
                                id="role"
                                className="input__select w__100"
                                value={update_role}
                                onChange={(e) => update_setRole(e.target.value)}
                            >
                                <option value="" disabled>
                                    Chosir un rôle
                                </option>
                                {roles.map((role) => (
                                    <option
                                        key={role._id}
                                        value={role._id}
                                    >
                                        {`${role._libelle}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Mot de passe :</label>
                            <input
                                className="input__text"
                                type="password"
                                id="password"
                                value={update_password}
                                placeholder="Définir un nouveau mot de passe"
                                onChange={(e) => update_setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-group d__flex  w__30">
                            <button className="input__button" type="submit">
                                Modifier
                            </button>
                            <a className="input__button" onClick={handleDelete}>
                                Supprimer
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DetailUtilisateur;