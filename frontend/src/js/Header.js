import React from 'react';
// import '../css/Header.css'; // Assurez-vous d'ajouter ce fichier CSS
import '../scss/app.scss'
import { useAuth } from './AuthContext'; // Importez le hook useAuth

function Header() {

    const { isLoggedIn, logout } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction

    isLoggedIn();

    return (
        <div className="header__container">
            <header className="header__header">
                <nav className="header__main-nav">
                    <ul>
                        <li>
                            <a href="/home">Accueil</a>
                        </li>
                        <li>
                            <a href="/tickets">Tickets</a>
                        </li>
                        <li>
                            <a href="/utilisateurs">Utilisateurs</a>
                        </li>
                        <li>
                            <a href="/roles">Roles</a>
                        </li>
                        <li>
                            <a href="/permissions">Permissions</a>
                        </li>
                    </ul>
                </nav>
                {isLoggedIn && (
                    <button className="header__logout-button" onClick={logout}>
                        Déconnexion
                    </button>
                )}
            </header>
        </div>
    );
}

export default Header;