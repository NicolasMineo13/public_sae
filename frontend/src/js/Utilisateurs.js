import React, { useState, useEffect } from 'react';
// import '../css/Utilisateurs.css';
import '../scss/app.scss'
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
            let url = 'http://localhost:5000/utilisateurs';

            if (selectedFilters.length > 0) {
                const filterParams = selectedFilters.map(filter => `${filter.field}=${encodeURIComponent(filter.value)}`);
                url += `?${filterParams.join('&')}`;
            }

            console.log('URL de la requête:', url);

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

    useEffect(() => {
        fetchUtilisateurs();
    }, [selectedFilters]);

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

    return (
        <div className="home__container">
            <Header />
            <div className="utilisateurs__container">
                <div className='top__header-page'>
                    <Link to='/home' className='utilisateurs__back-button'>
                        <FontAwesomeIcon icon={faArrowLeft} className='me-2' />
                    </Link>
                    <h1 className='m-0'>Liste des Utilisateurs</h1>
                    <button className='utilisateurs__button utilisateurs__button-create ms-3' onClick={handleCreateUtilisateur}>Créer un utilisateur</button>
                </div>
                <div className="utilisateurs__top-section-container">
                    <div className='utilisateurs__filter-container'>
                        <select className="utilisateurs__select" value={filterField} onChange={handleFilterFieldChange}>
                            <option value="id">ID</option>
                            <option value="nom">Nom</option>
                            <option value="prenom">Prénom</option>
                            <option value="email">E-mail</option>
                            <option value="login">Login</option>
                            <option value="role">Rôle</option>
                        </select>
                        <input className="utilisateurs__input" type="text" placeholder="Valeur de filtre..." value={filterValue} onChange={handleFilterValueChange} />
                        <button className='utilisateurs__button' onClick={handleAddFilter}>Ajouter</button>
                        <button className='utilisateurs__button' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                        <button className='utilisateurs__button ms-3' onClick={fetchUtilisateurs}>Filtrer</button>
                        <div className="utilisateurs__selected-filters">
                            {selectedFilters.map((filter, index) => (
                                <div key={index} className="utilisateurs__filter-item">
                                    {filter.field}: {filter.value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='utilisateurs__table-container'>
                    <div className="utilisateurs__table">
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
                                    <tr key={utilisateur._id}>
                                        <td>{utilisateur._id}</td>
                                        <td>{utilisateur._nom}</td>
                                        <td>{utilisateur._prenom}</td>
                                        <td>{utilisateur._email}</td>
                                        <td>{utilisateur._login}</td>
                                        <td>{utilisateur._role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Utilisateurs;