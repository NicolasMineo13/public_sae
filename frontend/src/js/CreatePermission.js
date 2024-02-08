import React, { useState } from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import back from '../assets/icons/back.svg';
import home from '../assets/icons/home.svg';
import API_BASE_URL from './config';

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
            const url = `${API_BASE_URL}/permissions?${queryParams.toString()}`;

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
        <div className="container-page">
            <Header />
            <div className="create-permission__container-page">
                <div className='top__header-page'>
                    <a href="/permissions">
                        <img className='back__button' src={back} />
                    </a>
                    <h1>Créer un Permission</h1>
                    <a className='m__initial' href="/home">
                        <img className='home__button' src={home} />
                    </a>
                </div>
                <div className='form-container'>
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