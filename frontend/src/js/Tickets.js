import React, { useState, useEffect } from 'react';
import '../css/Tickets.css'; // Assurez-vous d'ajouter ce fichier CSS
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import { useNavigate } from 'react-router-dom';

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [filterField, setFilterField] = useState('id'); // Champ de filtre par défaut
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const navigate = useNavigate(); // Obtenez la fonction navigate ici

    // Fonction pour rediriger vers la page de création de ticket
    const handleCreateTicket = () => {
        navigate('/tickets/create');
    };

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            let url = 'http://localhost:5000/tickets';

            // Si des filtres sont définis, ajoutez-les à l'URL de la requête
            if (selectedFilters.length > 0) {
                const filterParams = selectedFilters.map(filter => `${filter.field}=${encodeURIComponent(filter.value)}`);
                url += `?${filterParams.join('&')}`;
            }

            console.log('URL de la requête:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response.json();
            if (Array.isArray(data.tickets)) {
                setTickets(data.tickets);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [selectedFilters]);

    const handleFilterFieldChange = (e) => {
        setFilterField(e.target.value);
    };

    const handleFilterValueChange = (e) => {
        setFilterValue(e.target.value);
    };

    const handleAddFilter = () => {
        if (filterValue) {
            const existingFilterIndex = selectedFilters.findIndex(filter => filter.field === filterField);

            if (existingFilterIndex !== -1) {
                // Si un filtre avec le même champ existe, mettez à jour sa valeur
                const updatedFilters = [...selectedFilters];
                updatedFilters[existingFilterIndex].value = filterValue;
                setSelectedFilters(updatedFilters);
            } else {
                // Sinon, ajoutez un nouveau filtre
                setSelectedFilters([...selectedFilters, { field: filterField, value: filterValue }]);
            }

            setFilterField('id'); // Réinitialiser le champ de filtre
            setFilterValue('');
        }
    };

    return (
        <div className="tickets-container">
            <h1>Liste des Tickets</h1>
            <div className="filter-section">
                <select value={filterField} onChange={handleFilterFieldChange}>
                    <option value="id">ID</option>
                    <option value="titre">Titre</option>
                    <option value="description">Description</option>
                    <option value="date_creation">Date de création</option>
                    <option value="id_utilisateur_demandeur">Demandeur</option>
                    <option value="id_utilisateur_technicien">Technicien</option>
                    <option value="id_statut">Statut</option>
                    <option value="date_derniere_modif">Date de Modification</option>
                    <option value="date_cloture">Date de clôture</option>
                </select>
                <input
                    type="text"
                    placeholder="Valeur de filtre..."
                    value={filterValue}
                    onChange={handleFilterValueChange}
                />
                <button onClick={handleAddFilter}>Ajouter</button>
            </div>
            <div className="selected-filters">
                {selectedFilters.map((filter, index) => (
                    <div key={index} className="filter-item">
                        {filter.field}: {filter.value}
                    </div>
                ))}
            </div>
            <button onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
            <button className='button__filter' onClick={fetchTickets}>Filtrer</button>
            <button className='button__filter' onClick={handleCreateTicket}>Créer un ticket</button>
            <ul className="ticket-list">
                {tickets.map(ticket => (
                    <li key={ticket._id} className="ticket-item">
                        <div className="ticket-header">
                            <h2 className="ticket-title">{ticket._titre}</h2>
                            <span className="ticket-id">Ticket N° {ticket._id}</span>
                        </div>
                        <div className="ticket-description">
                            <p>{ticket._description}</p>
                        </div>
                        <div className="ticket-details">
                            <div className="detail">
                                <span className="detail-label">Date de création : </span>
                                <span className="detail-value">{ticket._date_creation}</span>
                            </div>
                            <div className="detail">
                                <span className="detail-label">Demandeur : </span>
                                <span className="detail-value">{ticket._id_utilisateur_demandeur}</span>
                            </div>
                            <div className="detail">
                                <span className="detail-label">Technicien : </span>
                                <span className="detail-value">{ticket._id_utilisateur_technicien}</span>
                            </div>
                            <div className="detail">
                                <span className="detail-label">Statut : </span>
                                <span className="detail-value">{ticket._id_statut}</span>
                            </div>
                            {ticket._date_derniere_modif && (
                                <div className="detail">
                                    <span className="detail-label">Date de dernière modification : </span>
                                    <span className="detail-value">{ticket._date_derniere_modif}</span>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default Tickets;