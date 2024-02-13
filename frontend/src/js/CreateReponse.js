import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import { useAuth } from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import back from '../assets/icons/back.svg';
import home from '../assets/icons/home.svg';
import API_BASE_URL from './config';

function CreateReponse() {
    const [libelle, setLibelle] = useState('');
    const [containsSolutions, setContainsSolutions] = useState(false); // État pour stocker si l'URL contient "solutions"

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    const { id } = useParams();

    // Fonction pour vérifier si l'URL contient "solutions"
    const checkForSolutionsInUrl = () => {
        const url = window.location.href;
        return url.includes("solutions");
    };

    useEffect(() => {
        // Au chargement de la page, vérifie si l'URL contient "solutions"
        const containsSolutions = checkForSolutionsInUrl();
        setContainsSolutions(containsSolutions);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id_ticket = id;

        // Récupérez la date actuelle
        const now = new Date();
        const date_creation = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
        const id_utilisateur = localStorage.getItem('id');

        // Créez un objet reponse avec les données entrées par l'utilisateur
        const newReponse = {
            libelle,
            date_creation,
            id_utilisateur,
            id_ticket
        };

        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            if (containsSolutions) {
                // let url_statuts = API_BASE_URL + '/statuts?libelle=Résolu';
                // let idStatutResolu = '';

                // const response_statuts = await fetch(url_statuts, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': token,
                //         'Refresh-Token': refreshToken
                //     },
                // });

                // if (!response_statuts.ok) {
                //     throw new Error('Erreur lors de la récupération des statuts');
                // }

                // const data_statuts = await response_statuts.json();
                // const resolvedStatus = data_statuts.statuts.find(status => status._libelle === 'Résolu');
                // if (resolvedStatus) {
                //     idStatutResolu = resolvedStatus._id
                //     console.log(idStatutResolu);
                // } else {
                //     throw new Error('Le statut résolu n\'a pas été trouvé');
                // }

                // const url_resolve = `${API_BASE_URL}/tickets/${id}?id_statut=${idStatutResolu}`;

                // const response_resolve = await fetch(url_resolve, {
                //     method: 'PATCH',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': token,
                //         'Refresh-Token': refreshToken
                //     },
                // });

                // if (!response_resolve.ok) {
                //     throw new Error('Erreur lors de l\'ajout de la réponse');
                // }
            }

            // Convertissez l'objet newReponse en une chaîne de requête
            let queryParams = new URLSearchParams(newReponse);

            if (containsSolutions) {
                queryParams += "&solution=1";
            }

            // Créez l'URL de la requête en ajoutant les paramètres de requête
            const url = `${API_BASE_URL}/reponses?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            if (response.ok) {
                // Redirigez l'utilisateur vers la page des reponses après la création réussie
                navigate(`/tickets/${id}`);
            } else {
                // Gérez les erreurs de la requête ici, par exemple afficher un message d'erreur
                console.error('Erreur lors de la création du reponse');
            }
        } catch (error) {
            console.error('Erreur lors de la création du reponse:', error);
        }
    };

    return (
        <div className="container-page">
            <Header />
            <div className="create-reponse__container-page">
                <div className='top__header-page'>
                    <div onClick={() => navigate(`/tickets/${id}`)}> {/* Modified here */}
                        <img className='back__button' src={back} />
                    </div>
                    <h1>{containsSolutions ? "Ajouter une Solution" : "Ajouter une Réponse"}</h1>
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
                        <button className="input__button" type="submit">Ajouter</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default CreateReponse;