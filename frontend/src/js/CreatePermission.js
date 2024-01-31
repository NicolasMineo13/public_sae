import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function CreatePermission() {
    const [libelle, setLibelle] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Créez un objet permission avec les données entrées par l'utilisateur
        const newPermission = {
            libelle,
        };

        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            // Convertissez l'objet newPermission en une chaîne de requête
            const queryParams = new URLSearchParams(newPermission);

            // Créez l'URL de la requête en ajoutant les paramètres de requête
            const url = `http://localhost:5000/permissions?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            if (response.ok) {
                // Redirigez l'utilisateur vers la page des permissions après la création réussie
                navigate('/permissions');
            } else {
                // Gérez les erreurs de la requête ici, par exemple afficher un message d'erreur
                console.error('Erreur lors de la création du permission');
            }
        } catch (error) {
            console.error('Erreur lors de la création du permission:', error);
        }
    };

    return (
        <div className="home__container">
            <Header />
            <div className="create-ticket__container-page">
                <div className='top__header-page'>
                    <Link to="/permissions" className="create-ticket__back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h1>Créer un Permission</h1>
                </div>
                <div className='create-ticket__form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="libelle">Libellé :</label>
                            <input className="input__text" type="text" id="libelle" placeholder='Libellé...' value={libelle} onChange={(e) => setLibelle(e.target.value)} required />
                        </div>
                        <button className="input__button" type="submit">Créer</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default CreatePermission;