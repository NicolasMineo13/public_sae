import React from 'react';
// import '../css/Header.css'; // Assurez-vous d'ajouter ce fichier CSS
import '../scss/app.scss'
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import home from '../assets/icons/home.svg';
import logout_img from '../assets/icons/logout.svg';
import ticket from '../assets/icons/ticket.svg';
import users from '../assets/icons/users.svg';
import roles from '../assets/icons/roles.svg';
import permissions from '../assets/icons/permissions.svg';

function Header() {

    const { isLoggedIn, logout } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction

    isLoggedIn();

    return (
        <div className="header__container">
            <header className="header__header">
                <nav className="header__main-nav">
                    <ul>
                        <li>
                            <img src={home}/>
                            <a href="/home">Accueil</a>
                        </li>
                        <li>
                            <img src={ticket}/>
                            <a href="/tickets">Tickets</a>
                        </li>
                        <li>
                            <img src={users}/>
                            <a href="/utilisateurs">Utilisateurs</a>
                        </li>
                        <li>
                            <img src={roles}/>
                            <a href="/roles">Roles</a>
                        </li>
                        <li>
                            <img src={permissions}/>
                            <a href="/permissions">Permissions</a>
                        </li>
                    </ul>
                </nav>
                {isLoggedIn && (
                    <div className='logout_container'>
                        <img  src={logout_img}/>
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