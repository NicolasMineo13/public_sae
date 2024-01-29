import React, { useState, useEffect } from 'react';
// import '../css/CreateTicket.css'; // Assurez-vous d'ajouter ce fichier CSS
import '../scss/app.scss'
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function CreateTicket() {
    const [titre, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date_creation, setCreationDate] = useState('');
    const [id_utilisateur_demandeur, setDemandeur] = useState('');
    const [id_utilisateur_technicien, setTechnicien] = useState('');
    const [id_statut, setStatut] = useState('');

    const [users, setUsers] = useState([]); // State to store the list of users

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = 'http://localhost:5000/utilisateurs';

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
            const url = `http://localhost:5000/tickets?${queryParams.toString()}`;

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
        <div className="home__container">
            <Header />
            <div className="create-ticket__container-page">
                <div className='top__header-page'>
                    <Link to="/tickets" className="create-ticket__back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h1>Créer un Ticket</h1>
                </div>
                <div className='create-ticket__form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="titre">Titre :</label>
                            <input type="text" id="titre" value={titre} onChange={(e) => setTitle(e.target.value)} className="create-ticket__input" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="description">Description :</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="create-ticket__input" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="date_creation">Date de Création :</label>
                            <input type="datetime-local" id="date_creation" value={date_creation} onChange={(e) => setCreationDate(e.target.value)} className="create-ticket__input" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_utilisateur_demandeur">Demandeur :</label>
                            <select
                                id="id_utilisateur_demandeur"
                                value={id_utilisateur_demandeur}
                                onChange={(e) => setDemandeur(e.target.value)}
                                className="create-ticket__input"
                                required
                            >
                                <option value="" disabled>Chosir un demandeur</option>
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
                                className="create-ticket__input"
                                required
                            >
                                <option value="" disabled>Chosir un technicien</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {`${user._prenom} ${user._nom}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_statut">Statut :</label>
                            <input type="text" id="id_statut" value={id_statut} onChange={(e) => setStatut(e.target.value)} className="create-ticket__input" required />
                        </div>
                        <button className="input__button" type="submit">Créer</button>
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default CreateTicket;