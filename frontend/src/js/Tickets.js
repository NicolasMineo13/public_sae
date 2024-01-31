import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ticket_img from '../assets/icons/add.svg'
import back from '../assets/icons/back.svg'

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

    const openDetail = (e) => {
        const ticketId = e.currentTarget.firstChild.textContent;
        navigate(`/tickets/${ticketId}`);
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
        if (tickets.length > 0) {
            // Fetch user names for demandeurs and techniciens
            tickets.forEach(ticket => {
                fetchUserNameById(ticket._id_utilisateur_demandeur);
                fetchUserNameById(ticket._id_utilisateur_technicien);
            });
        }
    }, [tickets]);

    const [statut, setStatuts] = useState({});

    // Function to fetch statut by ID
    const fetchStatutById = async (statutId) => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = `http://localhost:5000/statuts?id=${statutId}`;

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
            if (Array.isArray(data.statuts) && data.statuts.length > 0) {
                // Extract statut information from the first statut in the array
                const statut = data.statuts[0];
                setStatuts(prevStatuts => ({
                    ...prevStatuts,
                    [statutId]: `${statut._libelle}`
                }));
            } else {
                console.error('API response does not contain statut information:', data);
            }
        } catch (error) {
            console.error('Error fetching statut information:', error);
        }
    };

    useEffect(() => {
        if (tickets.length > 0) {
            // Fetch statut names for demandeurs and techniciens
            tickets.forEach(ticket => {
                fetchStatutById(ticket._id_statut);
            });
        }
    }, [tickets]);

    return (
        <div className="home__container">
            <Header />
            <div className="tickets__container-page">
                <div className='top__header-page'>
                    <a href="/home">
                        <img className='back__button' src={back} />
                    </a>
                    <h1 className='m-0'>Liste des Tickets</h1>
                    <div className='m__initial' onClick={handleCreateTicket}>
                        <img className='add__button' src={ticket_img} />
                    </div>
                </div>
                <div className='tickets__top-section-container'>
                    <div className="tickets__filter-container">
                        <div className='input-group input__group__block'>
                            <label>Catégorie </label>
                            <select className="input__select" value={filterField} onChange={handleFilterFieldChange}>
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
                        </div>
                        <div className='input-group input__group__block'>
                            <label>Recherche</label>
                            <input className="input__text" type="text" placeholder="Valeur de filtre..." value={filterValue} onChange={handleFilterValueChange} />
                        </div>
                        <div className='input-group input__group__block'>
                            <button className='input__button' onClick={handleAddFilter}>Ajouter un filtre</button>
                        </div>
                    </div>
                </div>
                {selectedFilters.length > 0 && (
                <div className="tickets__top-section-container">
                    <div className="tickets__filter-container j__start">
                        {selectedFilters.map((filter, index) => (
                            <div key={index} className="tickets__filter-item">
                                <span>{filter.field}: {filter.value}</span>
                            </div>
                        ))}
                        <button className='input__button m__initial' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                    </div>
                </div>)}
                <div className='tickets__table-container'>
                    <div className="tickets__table">
                        {tickets.length === 0 ? (
                            <p className='t__center'>Pas de tickets</p>
                        ) : (
                            <table>
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
                                        <tr className='pointer' onClick={openDetail} key={ticket._id}>
                                            <td>{ticket._id}</td>
                                            <td>{ticket._titre}</td>
                                            <td>{statut[ticket._id_statut] || 'Chargement...'}</td>
                                            <td>{new Date(ticket._date_derniere_modif).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                            <td>{new Date(ticket._date_creation).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                                            <td>{userNames[ticket._id_utilisateur_demandeur] || 'Chargement...'}</td>
                                            <td>{userNames[ticket._id_utilisateur_technicien] || 'Chargement...'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        )}
                    </div>
                </div>
            </div>

        </div>

    );
}

export default Tickets;