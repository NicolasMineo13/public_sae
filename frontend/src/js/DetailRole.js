import React, { useState, useEffect } from "react";
import "../scss/app.scss";
import { useAuth } from "./AuthContext"; // Importez le hook useAuth
import { useNavigate, Link, useParams } from "react-router-dom";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function DetailRole() {
    const [libelle, setLibelle] = useState('');

    const [update_libelle, update_setLibelle] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of users when the component mounts
        fetchRole();
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

        // Vérifiez s'il y a des champs modifiés
        if (Object.keys(updatedFields).length > 0) {
            // Au moins un champ a été modifié, vous pouvez effectuer la mise à jour ici
            // Créez les paramètres de requête en utilisant URLSearchParams
            const queryParams = new URLSearchParams(updatedFields);

            // Ajoutez les paramètres de requête à l'URL
            const patchUrl = `http://localhost:5000/roles/${id}?${queryParams.toString()}`;

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
                navigate('/roles');
            } else {
                // Gérez les erreurs de la requête ici
                console.error('Erreur lors de la mise à jour du role');
            }
        } else {
            // Aucun champ n'a été modifié, vous pouvez afficher un message ou ignorer la mise à jour
            console.log("Aucune modification n'a été apportée au role.");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshtoken');
        const url = `http://localhost:5000/roles/${id}`;
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
            navigate('/roles');
        } else {
            // Gérez les erreurs de la requête ici
            console.error('Erreur lors de la suppression du role');
        }
    };

    const fetchRole = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = "http://localhost:5000/roles?id=" + id;

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
            if (Array.isArray(data.roles) && data.roles.length > 0) {
                const RoleData = data.roles[0];
                setLibelle(RoleData._libelle);
                // Séparation des données de mise à jour
                update_setLibelle(RoleData._libelle);
            } else {
                console.error(
                    "API response does not contain role information:",
                    data
                );
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    return (
        <div className="home__container">
            <Header />
            <div className="create-ticket__container-page">
                <div className="top__header-page">
                    <Link to="/roles" className="create-ticket__back-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h1>Affichage du role N°{id} - {libelle}</h1>
                </div>
                <div className="create-ticket__form-container">
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

export default DetailRole;