import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; // Assurez-vous d'ajouter ce fichier CSS
import { useAuth } from './AuthContext'; // Importez le hook useAuth


function HomePage() {

    const navigate = useNavigate(); // Ajout de la déclaration de navigate
    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction

    isLoggedIn();

    const logout = async () => {
        try {
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            const response = await fetch(`http://localhost:5000/utilisateurs/logout/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('id');
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    return (
        <div className="home-container">
            <header className="header">
                <nav className="main-nav">
                    <ul>
                        <li>
                            <a href="/tickets">Tickets</a>
                        </li>
                        <li>
                            <a href="#">Utilisateurs</a>
                        </li>
                        <li>
                            <a href="#">Roles</a>
                        </li>
                        <li>
                            <a href="#">Permissions</a>
                        </li>
                    </ul>
                </nav>
                {isLoggedIn && (
                    <button className="logout-button" onClick={logout}>
                        Déconnexion
                    </button>
                )}
            </header>
            {/* Contenu de la page ici */}
        </div>
    );
}

export default HomePage;