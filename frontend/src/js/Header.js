import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import home from '../assets/icons/home.svg';
import logout_img from '../assets/icons/logout.svg';
import ticket from '../assets/icons/ticket.svg';
import users from '../assets/icons/users.svg';
import roles_img from '../assets/icons/roles.svg';
import permissions from '../assets/icons/permissions.svg';
import statuts from '../assets/icons/statuts.svg';
import docs from '../assets/icons/docs.svg';
import person from '../assets/icons/person.svg';
import API_BASE_URL from './config';

function Header() {

    const { isLoggedIn, logout } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction
    const navigate = useNavigate();
    const location = useLocation();

    const [utilisateur, setUtilisateur] = useState([]);
    const [roles, setRoles] = useState([]);

    const id = localStorage.getItem('id');

    const fetchUtilisateur = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = API_BASE_URL + `/utilisateurs?id=${id}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }

            const data = await response.json();
            // console.log(data);
            if (Array.isArray(data.utilisateurs)) {
                setUtilisateur(data.utilisateurs[0]);
            } else {
                console.error('La réponse API ne renvoie pas un tableau d\'utilisateurs:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = `${API_BASE_URL}/roles`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching role information');
            }

            const data = await response.json();
            // console.log(data);
            if (Array.isArray(data.roles)) {
                setRoles(data.roles);
            } else {
                console.error('API response does not contain role information:', data);
            }
        } catch (error) {
            console.error('Error fetching role information:', error);
        }
    };

    useEffect(() => {
        if (location.pathname !== '/docs') {
            fetchUtilisateur();
            fetchRoles();
        }
    }, []);

    return (
        <div className="header__container">
            {utilisateur && roles && ( // Affichage des infos de l'utilisateur s'il existe
                <div className="user-info">
                    <img src={person} alt='ticket' />
                    <span>{utilisateur._prenom} {utilisateur._nom}</span>
                    <span>{roles.find(role => role._id === utilisateur._role)?._libelle}</span>
                </div>
            )}
            <header className="header__header">
                <nav className="header__main-nav">
                    <ul>
                        <li className={location.pathname === '/home' ? 'active' : ''} onClick={() => navigate('/home')}>
                            <img src={home} alt='home' />
                            <span>Accueil</span>
                        </li>
                        <li className={location.pathname === '/tickets' ? 'active' : ''} onClick={() => navigate('/tickets')}>
                            <img src={ticket} alt='ticket' />
                            <span>Tickets</span>
                        </li>
                        <li className={location.pathname === '/utilisateurs' ? 'active' : ''} onClick={() => navigate('/utilisateurs')}>
                            <img src={users} alt='users' />
                            <span>Utilisateurs</span>
                        </li>
                        <li className={location.pathname === '/roles' ? 'active' : ''} onClick={() => navigate('/roles')}>
                            <img src={roles_img} alt='roles' />
                            <span>Roles</span>
                        </li>
                        {/* <li className={location.pathname === '/permissions' ? 'active' : ''} onClick={() => navigate('/permissions')}>
                            <img src={permissions} alt='permissions' />
                            <span>Permissions</span>
                        </li> */}
                        <li className={location.pathname === '/statuts' ? 'active' : ''} onClick={() => navigate('/statuts')}>
                            <img src={statuts} alt='statuts' />
                            <span>Statuts</span>
                        </li>
                        <li className={location.pathname === '/docs' ? 'active' : ''} onClick={() => navigate('/docs')}>
                            <img src={docs} alt='docs' />
                            <span>Docs</span>
                        </li>
                    </ul>
                </nav>
                {isLoggedIn && location.pathname !== '/docs' && (
                    <div className='logout_container'>
                        <img src={logout_img} alt='logout' />
                        <button className="header__logout-button" onClick={logout}>
                            Déconnexion
                        </button>
                    </div>
                )}
            </header>
        </div>
    );
}

export default Header;