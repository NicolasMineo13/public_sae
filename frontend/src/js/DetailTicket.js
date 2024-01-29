import React, { useState, useEffect } from "react";
// import '../css/DetailTicket.css'; // Assurez-vous d'ajouter ce fichier CSS
import "../scss/app.scss";
import { useAuth } from "./AuthContext"; // Importez le hook useAuth
import { useNavigate, Link, useParams } from "react-router-dom";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function DetailTicket() {
    const [titre, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date_creation, setCreationDate] = useState('');
    const [id_utilisateur_demandeur, setDemandeur] = useState('');
    const [id_utilisateur_technicien, setTechnicien] = useState('');
    const [id_statut, setStatut] = useState('');

    const [update_titre, update_setTitle] = useState('');
    const [update_description, update_setDescription] = useState('');
    const [update_date_creation, update_setCreationDate] = useState('');
    const [update_id_utilisateur_demandeur, update_setDemandeur] = useState('');
    const [update_id_utilisateur_technicien, update_setTechnicien] = useState('');
    const [update_id_statut, update_setStatut] = useState('');

    const [users, setUsers] = useState([]); // State to store the list of users

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchUsers();
        fetchTicket();
    }, []);

    const { id } = useParams();

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Créez un objet pour stocker les valeurs modifiées
        const updatedFields = {};

        // Comparez chaque champ avec sa valeur d'origine et ajoutez-le à l'objet de mise à jour s'il a été modifié
        if (titre !== update_titre) {
            updatedFields.titre = update_titre;
        }
        if (description !== update_description) {
            updatedFields.description = update_description;
        }
        if (date_creation !== update_date_creation) {
            updatedFields.date_creation = update_date_creation;
        }
        if (id_utilisateur_demandeur !== update_id_utilisateur_demandeur) {
            updatedFields.id_utilisateur_demandeur = update_id_utilisateur_demandeur;
        }
        if (id_utilisateur_technicien !== update_id_utilisateur_technicien) {
            updatedFields.id_utilisateur_technicien = update_id_utilisateur_technicien;
        }
        if (id_statut !== update_id_statut) {
            updatedFields.id_statut = update_id_statut;
        }

        // Vérifiez s'il y a des champs modifiés
        if (Object.keys(updatedFields).length > 0) {
            // Au moins un champ a été modifié, vous pouvez effectuer la mise à jour ici
            // Créez les paramètres de requête en utilisant URLSearchParams
            const queryParams = new URLSearchParams(updatedFields);

            // Ajoutez les paramètres de requête à l'URL
            const patchUrl = `http://localhost:5000/tickets/${id}?${queryParams.toString()}`;
            console.log("URL de la requête PATCH :", patchUrl);

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
                navigate('/tickets');
            } else {
                // Gérez les erreurs de la requête ici
                console.error('Erreur lors de la mise à jour du ticket');
            }
        } else {
            // Aucun champ n'a été modifié, vous pouvez afficher un message ou ignorer la mise à jour
            console.log("Aucune modification n'a été apportée au ticket.");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshtoken');
        const url = `http://localhost:5000/tickets/${id}`;
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
            navigate('/tickets');
        } else {
            // Gérez les erreurs de la requête ici
            console.error('Erreur lors de la suppression du ticket');
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = "http://localhost:5000/utilisateurs";

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
            if (Array.isArray(data.utilisateurs)) {
                // Set the list of users in the state
                setUsers(data.utilisateurs);
            } else {
                console.error("API response does not contain user information:", data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTicket = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = "http://localhost:5000/tickets?id=" + id;

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
            if (Array.isArray(data.tickets) && data.tickets.length > 0) {
                const TicketData = data.tickets[0];
                setTitle(TicketData._titre);
                setDescription(TicketData._description);
                setCreationDate(TicketData._date_creation);
                setDemandeur(TicketData._id_utilisateur_demandeur);
                setTechnicien(TicketData._id_utilisateur_technicien);
                setStatut(TicketData._id_statut);
                // Séparation des données de mise à jour
                update_setTitle(TicketData._titre);
                update_setDescription(TicketData._description);
                update_setCreationDate(TicketData._date_creation);
                update_setDemandeur(TicketData._id_utilisateur_demandeur);
                update_setTechnicien(TicketData._id_utilisateur_technicien);
                update_setStatut(TicketData._id_statut);
            } else {
                console.error(
                    "API response does not contain ticket information:",
                    data
                );
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    return (
        <div className="home__container">
            <Header />
            <div className="create-ticket__container-page">
                <div className="top__header-page">
                    <Link to="/tickets" className="create-ticket__back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h1>Affichage du ticket N°{id} - {update_titre}</h1>
                </div>
                <div className="create-ticket__form-container">
                    <form onSubmit={handleUpdate}>
                        <div className="input-group">
                            <label htmlFor="titre">Titre :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="titre"
                                value={update_titre}
                                onChange={(e) => update_setTitle(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="description">Description :</label>
                            <textarea
                                className="input__text"
                                id="description"
                                value={update_description}
                                onChange={(e) => update_setDescription(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="date_creation">Date de Création :</label>
                            <input
                                className="input__text"
                                type="datetime-local"
                                id="date_creation"
                                value={update_date_creation}
                                onChange={(e) => update_setCreationDate(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_utilisateur_demandeur">Demandeur :</label>
                            <select
                                id="id_utilisateur_demandeur"
                                className="create-ticket__input"
                                value={update_id_utilisateur_demandeur}
                                onChange={(e) => update_setDemandeur(e.target.value)}
                            >
                                <option value="" disabled>
                                    Chosir un demandeur
                                </option>
                                {users.map((user) => (
                                    <option
                                        key={user._id}
                                        value={user._id}
                                    >
                                        {`${user._prenom} ${user._nom}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_utilisateur_technicien">Technicien :</label>
                            <select
                                id="id_utilisateur_technicien"
                                className="create-ticket__input"
                                value={update_id_utilisateur_technicien}
                                onChange={(e) => update_setTechnicien(e.target.value)}
                            >
                                <option value="" disabled>
                                    Chosir un technicien
                                </option>
                                {users.map((user) => (
                                    <option
                                        key={user._id}
                                        value={user._id}
                                    >
                                        {`${user._prenom} ${user._nom}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_statut">Statut :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="id_statut"
                                value={update_id_statut}
                                onChange={(e) => update_setStatut(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
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

export default DetailTicket;