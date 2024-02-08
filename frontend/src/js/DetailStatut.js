import React, { useState, useEffect } from "react";
import "../scss/app.scss";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ChromePicker } from 'react-color';
import Header from "./Header";
import home from '../assets/icons/home.svg';
import back from '../assets/icons/back.svg';
import API_BASE_URL from './config';

function DetailStatut() {
    const [libelle, setLibelle] = useState('');
    const [couleur, setCouleur] = useState('');

    const [update_libelle, update_setLibelle] = useState('');
    const [update_couleur, update_setCouleur] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchStatut();
    }, []);

    const { id } = useParams();

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Créez un objet pour stocker les valeurs modifiées
        const updatedFields = {};

        // Comparez chaque champ avec sa valeur d'origine et ajoutez-le à l'objet de mise à jour s'il a été modifié
        if (libelle !== update_libelle) {
            updatedFields.libelle = update_libelle;
        }

        if (couleur !== update_couleur) {
            updatedFields.couleur = update_couleur;
        }

        // Vérifiez s'il y a des champs modifiés
        if (Object.keys(updatedFields).length > 0) {
            // Au moins un champ a été modifié, vous pouvez effectuer la mise à jour ici
            // Créez les paramètres de requête en utilisant URLSearchParams
            const queryParams = new URLSearchParams(updatedFields);

            // Ajoutez les paramètres de requête à l'URL
            const patchUrl = `${API_BASE_URL}/statuts/${id}?${queryParams.toString()}`;

            // Obtenez le jeton d'accès et le jeton de rafraîchissement du stockage local
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            // Exemple d'envoi de la requête PATCH (vous devrez adapter cela à votre API)
            const response = await fetch(patchUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            // Si la mise à jour réussit, redirigez l'utilisateur
            if (response.ok) {
                navigate('/statuts');
            } else {
                // Gérez les erreurs de la requête ici
                console.error('Erreur lors de la mise à jour du statut');
            }
        } else {
            // Aucun champ n'a été modifié, vous pouvez afficher un message ou ignorer la mise à jour
            console.log("Aucune modification n'a été apportée au statut.");
        }
    };

    const handleColorChange = (color) => {
        update_setCouleur(color.hex);
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshtoken');
        const url = `${API_BASE_URL}/statuts/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'Refresh-Token': refreshToken,
            },
        });

        // Si la suppression réussit, redirigez l'utilisateur
        if (response.ok) {
            navigate('/statuts');
        } else {
            // Gérez les erreurs de la requête ici
            console.error('Erreur lors de la suppression du statut');
        }
    };

    const fetchStatut = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = API_BASE_URL + "/statuts?id=" + id;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching users");
            }

            const data = await response.json();
            if (Array.isArray(data.statuts) && data.statuts.length > 0) {
                const StatutData = data.statuts[0];
                if (StatutData._couleur === null) {
                    StatutData._couleur = '';
                }
                setLibelle(StatutData._libelle);
                setCouleur(StatutData._couleur);
                // Séparation des données de mise à jour
                update_setLibelle(StatutData._libelle);
                update_setCouleur(StatutData._couleur);
            } else {
                console.error(
                    "API response does not contain statut information:",
                    data
                );
            }
        } catch (error) {
            console.error("Error fetching statuts:", error);
        }
    };

    return (
        <div className="container-page">
            <Header />
            <div className="detail-statuts__container-page">
                <div className="top__header-page">
                    <a href="/statuts">
                        <img className='back__button' src={back} />
                    </a>
                    <h1>Affichage du statut N°{id} - {libelle}</h1>
                    <a className='m__initial' href="/home">
                        <img className='home__button' src={home} />
                    </a>
                </div>
                <div className="form-container">
                    <form onSubmit={handleUpdate}>
                        <div className="input-group">
                            <label htmlFor="libelle">Libellé :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="libelle"
                                value={update_libelle}
                                onChange={(e) => update_setLibelle(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="couleur">Couleur :</label>
                            <input
                                className="input__text"
                                type="text"
                                id="couleur"
                                placeholder="Couleur..."
                                defaultValue={update_couleur}
                                onChange={(e) => update_setCouleur(e.target.value)}
                            />
                        </div>
                        <div className="color-picker">
                            <ChromePicker
                                color={update_couleur}
                                onChange={handleColorChange}
                            />
                        </div>
                        <div className="input-group d__flex  w__30">
                            <button className="input__button" type="submit">
                                Modifier
                            </button>
                            <a className="input__button" onClick={handleDelete}>
                                Supprimer
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DetailStatut;