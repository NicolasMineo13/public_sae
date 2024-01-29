import React, { useState } from 'react';
import '../css/CreateUtilisateur.css'; // Assurez-vous d'ajouter ce fichier CSS
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function CreateUtilisateur() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id_role, setRole] = useState('');

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Créez un objet utilisateur avec les données entrées par l'utilisateur
        const newUtilisateur = {
            nom,
            prenom,
            email,
            password,
            id_role,
        };

        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            // Convertissez l'objet newUtilisateur en une chaîne de requête
            const queryParams = new URLSearchParams(newUtilisateur);

            // Créez l'URL de la requête en ajoutant les paramètres de requête
            const url = `http://localhost:5000/utilisateurs?${queryParams.toString()}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken,
                },
            });

            if (response.ok) {
                // Redirigez l'utilisateur vers la page des utilisateurs après la création réussie
                navigate('/utilisateurs');
            } else {
                // Gérez les erreurs de la requête ici, par exemple afficher un message d'erreur
                console.error('Erreur lors de la création du utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la création du utilisateur:', error);
        }
    };

    return (
        <div className="home__container">
            <Header />
            <div className="create-utilisateur__container">
                <Link to='/utilisateurs' className='create-utilisateur__back-button'>
                    <FontAwesomeIcon icon={faArrowLeft} className='me-2' />
                </Link>
                <h1>Créer un Utilisateur</h1>
                <form onSubmit={handleSubmit}>
                    <div className="create-utilisateur__form-group">
                        <label htmlFor="nom">Nom :</label>
                        <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} className="create-utilisateur__input" required />
                    </div>
                    <div className="create-utilisateur__form-group">
                        <label htmlFor="prenom">Prénom :</label>
                        <input type="text" id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="create-utilisateur__input" required />
                    </div>
                    <div className="create-utilisateur__form-group">
                        <label htmlFor="email">E-mail :</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="create-utilisateur__input" required />
                    </div>
                    <div className="create-utilisateur__form-group">
                        <label htmlFor="password">Mot de passe :</label>
                        <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="create-utilisateur__input" required />
                    </div>
                    <div className="create-utilisateur__form-group">
                        <label htmlFor="id_role">Rôle :</label>
                        <input type="text" id="id_role" value={id_role} onChange={(e) => setRole(e.target.value)} className="create-utilisateur__input" required />
                    </div>
                    <button className="create-utilisateur__button" type="submit">Créer</button>
                </form>
            </div>
        </div>
    );
}

export default CreateUtilisateur;