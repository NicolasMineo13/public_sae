import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; // Assurez-vous d'ajouter ce fichier CSS

function HomePage() {

    const navigate = useNavigate(); // Ajout de la déclaration de navigate

    // Fonction qui vérifie si l'utilisateur est connecté et s'il possède un token valide dans le local storage
    const isLoggedIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');

            const response = await fetch(`http://localhost:5000/verifyToken`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('id');
                navigate('/');
                return response.json().then((err) => {
                    throw new Error(err.error);
                });
            }

            const data = await response.json();

            if (data.status === true) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                return true;
            } else {
                throw new Error('Token expiré !.');
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
            return false;
        }
    };

    isLoggedIn();

    // Fonction qui déconnecte l'utilisateur http://localhost:5000/utilisateurs/logout/:id
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
                        <li><a href="#">Tickets</a>
                            <ul>
                                <li><a href="#">Voir</a></li>
                                <li><a href="#">Ajouter</a></li>
                                <li><a href="#">Modifier</a></li>
                                <li><a href="#">Supprimer</a></li>
                            </ul>
                        </li>
                        <li><a href="#">Utilisateurs</a>
                            <ul>
                                <li><a href="#">Voir</a></li>
                                <li><a href="#">Ajouter</a></li>
                                <li><a href="#">Modifier</a></li>
                                <li><a href="#">Supprimer</a></li>
                            </ul>
                        </li>
                        {/* Répétez pour les autres options */}
                    </ul>
                </nav>
                <button className="logout-button" onClick={logout}>Déconnexion</button>
            </header>
            {/* Contenu de la page ici */}
        </div>
    );
}

export default HomePage;