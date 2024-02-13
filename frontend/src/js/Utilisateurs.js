import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import ticket_img from '../assets/icons/add.svg';
import back from '../assets/icons/back.svg';
import API_BASE_URL from './config';

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [filterField, setFilterField] = useState('id');
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const navigate = useNavigate();

    const handleCreateUtilisateur = () => {
        navigate('/utilisateurs/create');
    };

    const { isLoggedIn } = useAuth();

    isLoggedIn();

    const fetchUtilisateurs = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            let url = API_BASE_URL + '/utilisateurs';

            if (selectedFilters.length > 0) {
                const filterParams = selectedFilters.map(filter => `${filter.field}=${encodeURIComponent(filter.value)}`);
                url += `?${filterParams.join('&')}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }

            const data = await response.json();
            if (Array.isArray(data.utilisateurs)) {
                setUtilisateurs(data.utilisateurs);
            } else {
                console.error('La réponse API ne renvoie pas un tableau d\'utilisateurs:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement

    useEffect(() => {
        fetchUtilisateurs()
            .then(() => setIsLoading(false)) // Marquer le chargement comme terminé
            .catch(() => setIsLoading(false)); // Gérer les erreurs et marquer le chargement comme terminé
    }, []);

    useEffect(() => {
        fetchUtilisateurs();
    }, [selectedFilters]);

    const openDetail = (e) => {
        const utilisateurId = e.currentTarget.firstChild.textContent;
        navigate(`/utilisateurs/${utilisateurId}`);
    };

    const handleFilterFieldChange = (e) => {
        setFilterField(e.target.value);
    };

    const handleFilterValueChange = (e) => {
        setFilterValue(e.target.value);
    };

    const handleAddFilter = () => {
        if (filterValue) {
            const existingFilterIndex = selectedFilters.findIndex(filter => filter.field === filterField);

            if (existingFilterIndex !== -1) {
                const updatedFilters = [...selectedFilters];
                updatedFilters[existingFilterIndex].value = filterValue;
                setSelectedFilters(updatedFilters);
            } else {
                setSelectedFilters([...selectedFilters, { field: filterField, value: filterValue }]);
            }

            setFilterValue('');
        }
    };

    const [roles, setRoles] = useState({});

    // Function to fetch role information by ID
    const fetchRoleById = async (roleId) => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            const url = `${API_BASE_URL}/roles?id=${roleId}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching role information');
            }

            const data = await response.json();
            if (Array.isArray(data.roles) && data.roles.length > 0) {
                // Extract role information from the first role in the array
                const role = data.roles[0];
                setRoles(prevRoles => ({
                    ...prevRoles,
                    [roleId]: `${role._libelle}`
                }));
            } else {
                console.error('API response does not contain role information:', data);
            }
        } catch (error) {
            console.error('Error fetching role information:', error);
        }
    };

    useEffect(() => {
        if (utilisateurs.length > 0) {
            // Fetch role names for demandeurs and techniciens
            utilisateurs.forEach(utilisateur => {
                fetchRoleById(utilisateur._role);
            });
        }
    }, [utilisateurs]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddFilter();
        }
    };

    return (
        <div className="container-page">
            <Header />
            <div className="utilisateurs__container">
                <div className='top__header-page'>
                    <div onClick={() => navigate("/home")}>
                        <img className='back__button' src={back} />
                    </div>
                    <h1 className='m-0'>Liste des Utilisateurs</h1>
                    <div className='m__initial' onClick={handleCreateUtilisateur}>
                        <img className='add__button' src={ticket_img} />
                    </div>
                </div>
                <div className="top-section-container">
                    <div className='filter-container'>
                        <div className='input-group input__group__block'>
                            <label>Catégorie</label>
                            <select className="input__select" value={filterField} onChange={handleFilterFieldChange}>
                                <option value="id">ID</option>
                                <option value="nom">Nom</option>
                                <option value="prenom">Prénom</option>
                                <option value="email">E-mail</option>
                                <option value="login">Login</option>
                                <option value="id_role">Rôle</option>
                            </select>
                        </div>
                        <div className='input-group input__group__block'>
                            <label>Recherche</label>
                            <input
                                className="input__text"
                                type="text"
                                placeholder="Valeur de filtre..."
                                value={filterValue}
                                onChange={handleFilterValueChange}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <div className='input-group input__group__block'>
                            <button className='input__button' onClick={handleAddFilter}>Ajouter un filtre</button>
                        </div>
                    </div>
                </div>
                {selectedFilters.length > 0 && (
                    <div className="top-section-container">
                        <div className="filter-container j__start">
                            {selectedFilters.map((filter, index) => (
                                <div key={index} className="filter-item">
                                    {filter.field}: {filter.value}
                                </div>
                            ))}
                            <button className='input__button' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                        </div>
                    </div>)}
                <div className='table-container'>
                    <div className="table">
                        {isLoading ? ( // Vérifier si le chargement est en cours
                            <p className='t__center'>Chargement des utilisateurs...</p>
                        ) : utilisateurs.length === 0 ? (
                            <p className='t__center'>Pas d'utilisateur</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>E-mail</th>
                                        <th>Login</th>
                                        <th>Rôle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {utilisateurs.map(utilisateur => (
                                        <tr className='pointer' key={utilisateur._id} onClick={openDetail}>
                                            <td>{utilisateur._id}</td>
                                            <td>{utilisateur._nom}</td>
                                            <td>{utilisateur._prenom}</td>
                                            <td>{utilisateur._email}</td>
                                            <td>{utilisateur._login}</td>
                                            <td>{roles[utilisateur._role] || 'Chargement...'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Utilisateurs;