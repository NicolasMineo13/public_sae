import React, { useState } from 'react';
import '../css/CreateTicket.css'; // Assurez-vous d'ajouter ce fichier CSS
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import { useNavigate } from 'react-router-dom';

function CreateTicket() {
    const [titre, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date_creation, setCreationDate] = useState('');
    const [id_utilisateur_demandeur, setDemandeur] = useState('');
    const [id_utilisateur_technicien, setTechnicien] = useState('');
    const [id_statut, setStatut] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

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
        <div className="create-ticket-container">
            <h1>Créer un Ticket</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titre">Titre :</label>
                    <input
                        type="text"
                        id="titre"
                        value={titre}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description :</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date_creation">Date de Création :</label>
                    <input
                        type="datetime-local"
                        id="date_creation"
                        value={date_creation}
                        onChange={(e) => setCreationDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="id_utilisateur_demandeur">Demandeur :</label>
                    <input
                        type="text"
                        id="id_utilisateur_demandeur"
                        value={id_utilisateur_demandeur}
                        onChange={(e) => setDemandeur(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="id_utilisateur_technicien">Technicien :</label>
                    <input
                        type="text"
                        id="id_utilisateur_technicien"
                        value={id_utilisateur_technicien}
                        onChange={(e) => setTechnicien(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="id_statut">Statut :</label>
                    <input
                        type="text"
                        id="id_statut"
                        value={id_statut}
                        onChange={(e) => setStatut(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default CreateTicket;