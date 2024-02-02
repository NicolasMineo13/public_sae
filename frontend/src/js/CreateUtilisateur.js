import React, { useState, useEffect } from 'react';
import '../scss/app.scss';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import home from '../assets/icons/home.svg';
import back from '../assets/icons/back.svg'

function CreateUtilisateur() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id_role, setRole] = useState('');

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]); // State to store the list of roles

    const { isLoggedIn } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction isLoggedIn

    isLoggedIn(); // Appelez la fonction isLoggedIn pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        // Fetch the list of roles when the component mounts
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const refreshToken = localStorage.getItem("refreshtoken");
            const url = "http://localhost:5000/roles";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                    "Refresh-Token": refreshToken,
                },
            });

            if (!response.ok) {
                throw new Error("Error fetching roles");
            }

            const data = await response.json();
            if (Array.isArray(data.roles)) {
                // Set the list of roles in the state
                setRoles(data.roles);
            } else {
                console.error("API response does not contain role information:", data);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

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
        <div className="container-page">
            <Header />
            <div className="create-utilisateur__container-page">
                <div className='top__header-page'>
                    <a href="/utilisateurs">
                        <img className='back__button' src={back} />
                    </a>
                    <h1>Créer un utilisateur</h1>
                    <a className='m__initial' href="/home">
                        <img className='home__button' src={home} />
                    </a>
                </div>
                <div className='create-utilisateur__form-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="nom">Nom :</label>
                            <input className="input__text" type="text" id="nom" placeholder='Nom...' value={nom} onChange={(e) => setNom(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="prenom">Prénom :</label>
                            <input className="input__text" type="text" id="prenom" placeholder='Prénom...' value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">E-mail :</label>
                            <input className="input__text" type="email" id="email" placeholder='E-mail...' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Mot de passe :</label>
                            <input className="input__text" type="password" id="password" placeholder='Mot de passe...' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="id_role">Rôle :</label>
                            <select
                                id="id_role"
                                value={id_role}
                                onChange={(e) => setRole(e.target.value)}
                                className="input__select"
                                required
                            >
                                <option value="" disabled>Choisir un rôle</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role._id}>
                                        {`${role._libelle}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="input__button" type="submit">Créer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateUtilisateur;