import React, { useState, useEffect } from 'react';
import '../css/Tickets.css';
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [filterField, setFilterField] = useState('id');
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const navigate = useNavigate();

    const handleCreateTicket = () => {
        navigate('/tickets/create');
    };

    const { isLoggedIn } = useAuth();

    isLoggedIn();

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            let url = 'http://localhost:5000/tickets';

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
                const updatedFilters = [...selectedFilters];
                updatedFilters[existingFilterIndex].value = filterValue;
                setSelectedFilters(updatedFilters);
            } else {
                setSelectedFilters([...selectedFilters, { field: filterField, value: filterValue }]);
            }

            setFilterValue('');
        }
    };

    const [userNames, setUserNames] = useState({});

    // Function to fetch user information by ID
    const fetchUserNameById = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = `http://localhost:5000/utilisateurs?id=${userId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching user information');
            }

            const data = await response.json();
            if (Array.isArray(data.utilisateurs) && data.utilisateurs.length > 0) {
                // Extract user information from the first user in the array
                const user = data.utilisateurs[0];
                setUserNames(prevUserNames => ({
                    ...prevUserNames,
                    [userId]: `${user._prenom} ${user._nom}`
                }));
            } else {
                console.error('API response does not contain user information:', data);
            }
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    useEffect(() => {
        // Fetch user names for demandeurs and techniciens
        tickets.forEach(ticket => {
            fetchUserNameById(ticket._id_utilisateur_demandeur);
            fetchUserNameById(ticket._id_utilisateur_technicien);
        });
    }, [tickets]);

    return (
        <div className="home__container">
            <Header />
            <div className="tickets__container">
                <div className='d-flex align-items-center justify-content-between'>
                    <Link to='/home' className='tickets__back-button'>
                        <FontAwesomeIcon icon={faArrowLeft} className='me-2' />
                    </Link>
                    <h1 className='m-0'>Liste des Tickets</h1>
                    <button className='tickets__button tickets__button-create ms-3' onClick={handleCreateTicket}>Créer un ticket</button>
                </div>
                <div className="tickets__filter-section">
                    <select className="tickets__select" value={filterField} onChange={handleFilterFieldChange}>
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
                    <input className="tickets__input" type="text" placeholder="Valeur de filtre..." value={filterValue} onChange={handleFilterValueChange} />
                    <button className='tickets__button' onClick={handleAddFilter}>Ajouter</button>
                </div>
                <div className="tickets__selected-filters">
                    {selectedFilters.map((filter, index) => (
                        <div key={index} className="tickets__filter-item">
                            {filter.field}: {filter.value}
                        </div>
                    ))}
                </div>
                <button className='tickets__button' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                <button className='tickets__button ms-3' onClick={fetchTickets}>Filtrer</button>
                <table className="tickets__table tickets__table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Statut</th>
                            <th>Dernière modification</th>
                            <th>Date de création</th>
                            <th>Demandeur</th>
                            <th>Technicien</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket._id}>
                                <td>{ticket._id}</td>
                                <td>{ticket._titre}</td>
                                <td>{ticket._id_statut}</td>
                                <td>{new Date(ticket._date_derniere_modif).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                <td>{new Date(ticket._date_creation).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                <td>{userNames[ticket._id_utilisateur_demandeur] || 'Chargement...'}</td>
                                <td>{userNames[ticket._id_utilisateur_technicien] || 'Chargement...'}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Tickets;