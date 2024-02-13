import React, { useState } from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import Header from './Header';
import back from '../assets/icons/back.svg';
import home from '../assets/icons/home.svg';
import API_BASE_URL from './config';

function CreateStatut() {
    const [libelle, setLibelle] = useState('');
    const [couleur, setCouleur] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Créez un objet statut avec les données entrées par l'utilisateur
        const newStatut = {
            libelle,
            couleur
        };

        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            // Convertissez l'objet newStatut en une chaîne de requête
            const queryParams = new URLSearchParams(newStatut);

            // Créez l'URL de la requête en ajoutant les paramètres de requête
            const url = `${API_BASE_URL}/statuts?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            if (response.ok) {
                // Redirigez l'utilisateur vers la page des statuts après la création réussie
                navigate('/statuts');
            } else {
                // Gérez les erreurs de la requête ici, par exemple afficher un message d'erreur
                console.error('Erreur lors de la création du statut');
            }
        } catch (error) {
            console.error('Erreur lors de la création du statut:', error);
        }
    };

    const handleColorChange = (color) => {
        setCouleur(color.hex);
    };

    return (
        <div className="container-page">
            <Header />
            <div className="create-statut__container-page">
                <div className='top__header-page'>
                    <div className='m__initial' onClick={() => navigate("/statuts")}>
                        <img className='back__button' src={back} />
                    </div>
                    <h1>Créer un Statut</h1>
                    <div onClick={() => navigate("/home")}>
                        <img className='home__button' src={home} />
                    </div>
                </div>
                <div className='form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="libelle">Libellé :</label>
                            <input className="input__text" type="text" id="libelle" placeholder='Libellé...' value={libelle} onChange={(e) => setLibelle(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="couleur">Couleur :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="couleur"
                                placeholder="Couleur..."
                                value={couleur}
                                onChange={(e) => setCouleur(e.target.value)}
                            />
                        </div>
                        <div className="color-picker">
                            <ChromePicker
                                color={couleur}
                                onChange={handleColorChange}
                            />
                        </div>
                        <button className="input__button" type="submit">Créer</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default CreateStatut;