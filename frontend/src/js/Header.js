import React from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import home from '../assets/icons/home.svg';
import logout_img from '../assets/icons/logout.svg';
import ticket from '../assets/icons/ticket.svg';
import users from '../assets/icons/users.svg';
import roles from '../assets/icons/roles.svg';
import permissions from '../assets/icons/permissions.svg';
import statuts from '../assets/icons/statuts.svg';

function Header() {

    const { isLoggedIn, logout } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="header__container">
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
                            <img src={roles} alt='roles' />
                            <span>Roles</span>
                        </li>
                        <li className={location.pathname === '/permissions' ? 'active' : ''} onClick={() => navigate('/permissions')}>
                            <img src={permissions} alt='permissions' />
                            <span>Permissions</span>
                        </li>
                        <li className={location.pathname === '/statuts' ? 'active' : ''} onClick={() => navigate('/statuts')}>
                            <img src={statuts} alt='statuts' />
                            <span>Statuts</span>
                        </li>
                    </ul>
                </nav>
                {isLoggedIn && (
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