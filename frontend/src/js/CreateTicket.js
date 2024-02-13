import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import Header from './Header';
import home from '../assets/icons/home.svg'
import back from '../assets/icons/back.svg'
import API_BASE_URL from './config';

function CreateTicket() {
    const [titre, setTitle] = useState('');
    const [description, setDescription] = useState('');
    let [id_utilisateur_demandeur, setDemandeur] = useState('');
    const [id_utilisateur_technicien, setTechnicien] = useState('');
    let [id_statut, setStatut] = useState('');

    const date_creation = moment().tz('Europe/Paris').format('YYYY-MM-DD HH:mm');
    id_statut = '1';
    const id = localStorage.getItem('id');
    id_utilisateur_demandeur = id;

    const [users, setUsers] = useState([]); // State to store the list of users
    const [statuts, setStatuts] = useState([]); // State to store the list of users

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchStatuts();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = API_BASE_URL + '/utilisateurs';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching users');
            }

            const data = await response.json();
            if (Array.isArray(data.utilisateurs)) {
                // Set the list of users in the state
                setUsers(data.utilisateurs);
            } else {
                console.error('API response does not contain user information:', data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
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
                    Authorization: token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching users");
            }

            const data = await response.json();
            if (Array.isArray(data.statuts)) {
                const filteredStatuts = data.statuts.filter(statut => statut._libelle !== "Clôturé");
                setStatuts(filteredStatuts);
            } else {
                console.error("API response does not contain user information:", data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Créez un objet ticket avec les données entrées par l'utilisateur
        const newTicket = {
            titre,
            description,
            date_creation,
            id_utilisateur_demandeur,
            id_utilisateur_technicien,
            id_statut,
        };

        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            // Convertissez l'objet newTicket en une chaîne de requête
            const queryParams = new URLSearchParams(newTicket);

            // Créez l'URL de la requête en ajoutant les paramètres de requête
            const url = `${API_BASE_URL}/tickets?${queryParams.toString()}`;

            console.log("URL : " + url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            if (response.ok) {
                // Redirigez l'utilisateur vers la page des tickets après la création réussie
                navigate('/tickets');
            } else {
                // Gérez les erreurs de la requête ici, par exemple afficher un message d'erreur
                console.error('Erreur lors de la création du ticket');
            }
        } catch (error) {
            console.error('Erreur lors de la création du ticket:', error);
        }
    };

    return (
        <div className="container-page">
            <Header />
            <div className="create-ticket__container-page">
                <div className='top__header-page'>
                    <div onClick={() => navigate("/tickets")}>
                        <img className='back__button' src={back} />
                    </div>
                    <h1>Créer un Ticket</h1>
                    <div className='m__initial' onClick={() => navigate("/home")}>
                        <img className='home__button' src={home} />
                    </div>
                </div>
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="titre">Titre :</label>
                            <input className="input__text" type="text" id="titre" placeholder='Titre...' value={titre} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="description">Description :</label>
                            <textarea className="input__text" id="description" placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_utilisateur_demandeur">Demandeur :</label>
                            <select
                                id="id_utilisateur_demandeur"
                                value={id_utilisateur_demandeur}
                                onChange={(e) => setDemandeur(e.target.value)}
                                className="input__select"
                                required
                            >
                                <option value="" disabled>Choisir un demandeur</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {`${user._prenom} ${user._nom}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_utilisateur_technicien">Technicien :</label>
                            <select
                                id="id_utilisateur_technicien"
                                value={id_utilisateur_technicien}
                                onChange={(e) => setTechnicien(e.target.value)}
                                className="input__select"
                            // required
                            >
                                <option value="">Choisir un technicien</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {`${user._prenom} ${user._nom}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_statut">Statut :</label>
                            <select
                                id="id_statut"
                                value={id_statut}
                                onChange={(e) => setStatut(e.target.value)}
                                className="input__select"
                                required
                            >
                                <option value="" disabled>Choisir un statut</option>
                                {statuts.map((statut) => {
                                    if (statut._libelle !== "Clos" && statut._libelle !== "Résolu")
                                        return (
                                            <option
                                                key={statut._id}
                                                value={statut._id}
                                            >
                                                {`${statut._libelle}`}
                                            </option>
                                        );
                                })}
                            </select>
                        </div>
                        <button className="input__button" type="submit">Créer</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default CreateTicket;