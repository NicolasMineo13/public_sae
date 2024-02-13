import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';
import API_BASE_URL from './config';
import GraphStatutsTickets from './GraphStatutsTickets';
import GraphDatesTickets from './GraphDatesTickets';
import GraphUsersTickets from './GraphUsersTickets';
import GraphAllTickets from './GraphAllTickets';

function HomePage() {
    const { isLoggedIn } = useAuth();
    isLoggedIn();

    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshtoken');

    const [statuts, setStatuts] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        fetchStatuts();
        fetchTickets();
        fetchUserDetails();
    }, []);

    const fetchStatuts = async () => {
        try {
            let url_statuts = `${API_BASE_URL}/statuts`;

            const response_statuts = await fetch(url_statuts, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_statuts.ok) {
                throw new Error('Erreur lors de la récupération des statuts');
            }

            const data = await response_statuts.json();
            if (Array.isArray(data.statuts)) {
                setStatuts(data.statuts);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de statuts:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTickets = async () => {
        try {
            let url_tickets = `${API_BASE_URL}/tickets`;
            const response_tickets = await fetch(url_tickets, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_tickets.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response_tickets.json();
            if (Array.isArray(data.tickets)) {
                setTickets(data.tickets);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response_users = await fetch(`${API_BASE_URL}/utilisateurs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_users.ok) {
                throw new Error('Erreur lors de la récupération des détails des utilisateurs');
            }

            const userData = await response_users.json();
            if (Array.isArray(userData.utilisateurs)) {
                const userDetailsMap = {};
                userData.utilisateurs.forEach(user => {
                    userDetailsMap[user._id] = user;
                });
                setUserDetails(userDetailsMap);
            } else {
                console.error('La réponse API ne renvoie pas un tableau d\'utilisateurs:', userData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const id_statut_nouveau = statuts.find((s) => s._libelle === 'Nouveau')?._id;
    const id_statut_encours = statuts.find((s) => s._libelle === 'En cours')?._id;
    const id_statut_enattente = statuts.find((s) => s._libelle === 'En attente')?._id;
    const id_statut_resolu = statuts.find((s) => s._libelle === 'Résolu')?._id;
    const id_statut_clos = statuts.find((s) => s._libelle === 'Clos')?._id;

    const [ticketsNouveaux, setTicketsNouveaux] = useState([]);
    const [ticketsEnCours, setTicketsEnCours] = useState([]);
    const [ticketsEnAttente, setTicketsEnAttente] = useState([]);
    const [ticketsResolus, setTicketsResolus] = useState([]);
    const [ticketsClos, setTicketsClos] = useState([]);

    const [nbTicketsNouveaux, setNbTicketsNouveaux] = useState(0);
    const [nbTicketsEnCours, setNbTicketsEnCours] = useState(0);
    const [nbTicketsEnAttente, setNbTicketsEnAttente] = useState(0);
    const [nbTicketsResolus, setNbTicketsResolus] = useState(0);
    const [nbTicketsClos, setNbTicketsClos] = useState(0);

    useEffect(() => {
        if (statuts.length > 0) {
            fetchTicketsNouveaux();
            fetchTicketsEnCours();
            fetchTicketsEnAttente();
            fetchTicketsResolus();
            fetchTicketsClos();
        }
    }, [statuts]);

    const fetchTicketsNouveaux = async () => {
        try {
            let url_tickets_nouveaux = `${API_BASE_URL}/tickets?id_statut=${id_statut_nouveau}`;
            const response_tickets_nouveaux = await fetch(url_tickets_nouveaux, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_tickets_nouveaux.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response_tickets_nouveaux.json();
            if (Array.isArray(data.tickets)) {
                setTicketsNouveaux(data.tickets);
                setNbTicketsNouveaux(data.tickets.length);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTicketsEnCours = async () => {
        try {
            let url_tickets_encours = `${API_BASE_URL}/tickets?id_statut=${id_statut_encours}`;
            const response_tickets_encours = await fetch(url_tickets_encours, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_tickets_encours.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response_tickets_encours.json();
            if (Array.isArray(data.tickets)) {
                setTicketsEnCours(data.tickets);
                setNbTicketsEnCours(data.tickets.length);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTicketsEnAttente = async () => {
        try {
            let url_tickets_enattente = `${API_BASE_URL}/tickets?id_statut=${id_statut_enattente}`;
            const response_tickets_enattente = await fetch(url_tickets_enattente, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_tickets_enattente.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response_tickets_enattente.json();
            if (Array.isArray(data.tickets)) {
                setTicketsEnAttente(data.tickets);
                setNbTicketsEnAttente(data.tickets.length);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTicketsResolus = async () => {
        try {
            let url_tickets_resolus = `${API_BASE_URL}/tickets?id_statut=${id_statut_resolu}`;
            const response_tickets_resolus = await fetch(url_tickets_resolus, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_tickets_resolus.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response_tickets_resolus.json();
            if (Array.isArray(data.tickets)) {
                setTicketsResolus(data.tickets);
                setNbTicketsResolus(data.tickets.length);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTicketsClos = async () => {
        try {
            let url_tickets_clos = `${API_BASE_URL}/tickets?id_statut=${id_statut_clos}`;
            const response_tickets_clos = await fetch(url_tickets_clos, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response_tickets_clos.ok) {
                throw new Error('Erreur lors de la récupération des tickets');
            }

            const data = await response_tickets_clos.json();
            if (Array.isArray(data.tickets)) {
                setTicketsClos(data.tickets);
                setNbTicketsClos(data.tickets.length);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de tickets:', data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='container-page'>
            <Header />
            <div className="dashboard">
                <div className="top-left">
                    <GraphStatutsTickets nbTicketsNouveaux={nbTicketsNouveaux} nbTicketsEnCours={nbTicketsEnCours} nbTicketsEnAttente={nbTicketsEnAttente} nbTicketsResolus={nbTicketsResolus} nbTicketsClos={nbTicketsClos} />
                </div>
                <div className="top-right">
                    <GraphDatesTickets tickets={tickets} />
                </div>
                <div className="bottom-left">
                    <GraphUsersTickets tickets={tickets} userDetails={userDetails} />
                </div>
                <div className="bottom-right">
                    <GraphAllTickets tickets={tickets} />
                </div>
            </div>
        </div>
    );
}

export default HomePage;