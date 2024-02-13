import React, { useState, useEffect } from "react";
import "../scss/app.scss";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import home from '../assets/icons/home.svg';
import back from '../assets/icons/back.svg';
import deleteIcon from '../assets/icons/delete.svg';
import API_BASE_URL from './config';

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
    const [statuts, setStatuts] = useState([]); // State to store the list of users
    const [reponses, setReponses] = useState([]); // State to store the list of users

    const [clotureId, setClotureId] = useState('');
    const [resoluId, setResoluId] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    const user_connected = localStorage.getItem("id");

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchTicket();
        fetchUsers();
        fetchStatuts();
        fetchReponses();
    }, []);

    const { id } = useParams();

    const handleCreateReponse = () => {
        navigate(`/tickets/reponses/${id}`);
    };

    const handleCreateSolution = () => {
        navigate(`/tickets/solutions/${id}`);
    };

    const handleDeleteReponse = async (id_reponse) => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshtoken');
        const url = `${API_BASE_URL}/reponses/${id_reponse}`;
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
            fetchUsers();
            fetchStatuts();
            fetchTicket();
            fetchReponses();
        } else {
            // Gérez les erreurs de la requête ici
            console.error('Erreur lors de la suppression du ticket');
        }
    }

    // Function to fetch responses
    const fetchReponses = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = `${API_BASE_URL}/reponses?id_ticket=${id}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching responses");
            }

            const data = await response.json();
            if (Array.isArray(data.reponses)) {
                setReponses(data.reponses);
            } else {
                console.error("API response does not contain response information:", data);
            }
        } catch (error) {
            console.error("Error fetching responses:", error);
        }
    };

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
            const patchUrl = `${API_BASE_URL}/tickets/${id}?${queryParams.toString()}`;

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
        const url = `${API_BASE_URL}/tickets/${id}`;
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

    const handleCloture = async (e) => {
        e.preventDefault();

        // Prendre l'id du statut 'Clos'
        const id_cloture = statuts.filter(statut => statut._libelle === 'Clos')[0]._id;

        // Ajoutez les paramètres de requête à l'URL
        const patchUrl = `${API_BASE_URL}/tickets/${id}?id_statut=${id_cloture}`;

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

        // Si la clôture réussit, redirigez l'utilisateur
        if (response.ok) {
            navigate('/tickets');
        } else {
            // Gérez les erreurs de la requête ici
            console.error('Erreur lors de la clôture du ticket');
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = API_BASE_URL + "/utilisateurs";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
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

    const fetchStatuts = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = API_BASE_URL + "/statuts";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching users");
            }

            const data = await response.json();
            if (Array.isArray(data.statuts)) {
                setStatuts(data.statuts);
                setClotureId(data.statuts.filter(statut => statut._libelle === 'Clos')[0]._id);
                setResoluId(data.statuts.filter(statut => statut._libelle === 'Résolu')[0]._id);
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
            const url = API_BASE_URL + "/tickets?id=" + id;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
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
        <div className="container-page">
            <Header />
            <div className="detail-ticket__container-page">
                <div className="top__header-page">
                    <div onClick={() => navigate("/tickets")}>
                        <img className='back__button' src={back} />
                    </div>
                    <h1>Affichage du ticket N°{id} - {titre}</h1>
                    <div className='m__initial' onClick={() => navigate("/home")}>
                        <img className='home__button' src={home} />
                    </div>
                </div>
                <div className="details-response-container">
                    <div className="ticket-info-container">
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
                                    value={update_date_creation ? update_date_creation.slice(0, 16) : ""}
                                    onChange={(e) => update_setCreationDate(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="id_utilisateur_demandeur">Demandeur :</label>
                                <select
                                    id="id_utilisateur_demandeur"
                                    className="input__select w__100"
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
                                    className="input__select w__100"
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
                                <select
                                    id="id_statut"
                                    className="input__select w__100"
                                    value={update_id_statut}
                                    onChange={(e) => update_setStatut(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Chosir un statut
                                    </option>
                                    {statuts.map((statut) => {
                                        if (statut._libelle !== 'Clos' && statut._libelle !== 'Résolu' && update_id_statut !== clotureId && update_id_statut !== resoluId) {
                                            return (
                                                <option
                                                    key={statut._id}
                                                    value={statut._id}
                                                >
                                                    {`${statut._libelle}`}
                                                </option>
                                            );
                                        } else if (statut._libelle == 'Clos' && update_id_statut == clotureId) {
                                            return (
                                                <option
                                                    key={statut._id}
                                                    value={statut._id}
                                                >
                                                    {`${statut._libelle}`}
                                                </option>
                                            );
                                        } else if (statut._libelle == 'Résolu' && update_id_statut == resoluId) {
                                            return (
                                                <option
                                                    key={statut._id}
                                                    value={statut._id}
                                                >
                                                    {`${statut._libelle}`}
                                                </option>
                                            );
                                        }
                                        return null;
                                    })}
                                </select>
                            </div>
                            <div className="input-group">
                                {update_id_statut !== clotureId && (
                                    <button className="input__button w__100 j__center" type="submit">
                                        Modifier
                                    </button>
                                )}
                                <button className="input__button w__100 j__center" onClick={handleDelete}>
                                    Supprimer
                                </button>
                                {update_id_statut !== clotureId && (
                                    <button className="input__button w__100 j__center" onClick={handleCloture}>
                                        Clôturer
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="response-info-container">
                        {reponses.length === 0 && update_id_statut !== clotureId ? (
                            <div className="reponse-other-container">
                                <div className="reponse">
                                    <span>Soyez le premier à répondre</span>
                                </div>
                            </div>
                        ) : (
                            reponses.map((response) => {
                                const user_id_reponse = users.find((user) => user._id === response._id_utilisateur);
                                const isDemandeur = user_id_reponse && user_id_reponse._id == id_utilisateur_demandeur;
                                const containerClass = isDemandeur ? "reponse-container" : "reponse-other-container";
                                const formattedDate = response._date_derniere_modif
                                    ? new Date(response._date_derniere_modif).toLocaleString("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "Date non valide";
                                return (
                                    <div key={response._id} className={containerClass}>
                                        <div className="reponse">
                                            <div className="header-response">
                                                <div className="text">
                                                    <span>{user_id_reponse ? `${user_id_reponse._prenom} ${user_id_reponse._nom}` : "Chargement en cours..."}</span>
                                                    <span>{user_id_reponse && user_id_reponse._id === id_utilisateur_demandeur ? "(Demandeur)" : user_id_reponse && user_id_reponse._id === id_utilisateur_technicien ? "(Technicien)" : ""}</span>
                                                    <span>Le : {formattedDate}</span>
                                                    <span>{response._solution === 1 ? "Solution apportée" : ""}</span>
                                                </div>
                                                <div className="trash">
                                                    <img className='back__button' src={deleteIcon} onClick={() => handleDeleteReponse(response._id)} />
                                                </div>
                                            </div>
                                            <span>{response._libelle}</span>
                                            
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div className='reponse-other-container'>
                            {reponses.length > 0 && reponses[reponses.length - 1]._solution !== 1 && (
                                <button className="input__button m__initial" onClick={handleCreateSolution}>
                                    Ajouter une solution
                                </button>
                            )}
                            {update_id_statut != clotureId && (reponses.length > 0 && reponses[reponses.length - 1]._solution == 1 && reponses[reponses.length - 1]._id_utilisateur != user_connected) && (
                                <button className="input__button m__initial ms-2" onClick={handleCreateReponse}>
                                    Répondre
                                </button>
                            )}
                            {reponses.length == 0 && update_id_statut != clotureId && (
                                <button className="input__button m__initial ms-2" onClick={handleCreateReponse}>
                                    Répondre
                                </button>
                            )}
                            {reponses.length > 0 && reponses[reponses.length - 1]._solution !== 1 && update_id_statut != clotureId && (
                                <button className="input__button m__initial ms-2" onClick={handleCreateReponse}>
                                    Répondre
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailTicket;