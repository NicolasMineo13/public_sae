import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import ticket_img from '../assets/icons/add.svg'
import back from '../assets/icons/back.svg'
import API_BASE_URL from './config';

function Permissions() {
    const [permissions, setPermissions] = useState([]);
    const [filterField, setFilterField] = useState('id');
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const navigate = useNavigate();

    const handleCreatePermission = () => {
        navigate('/permissions/create');
    };

    const { isLoggedIn } = useAuth();

    isLoggedIn();

    const fetchPermissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            let url = API_BASE_URL + '/permissions';

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
                throw new Error('Erreur lors de la récupération des permissions');
            }

            const data = await response.json();
            if (Array.isArray(data.permissions)) {
                setPermissions(data.permissions);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de permissions:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
        }
    };

    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement

    useEffect(() => {
        fetchPermissions()
            .then(() => setIsLoading(false)) // Marquer le chargement comme terminé
            .catch(() => setIsLoading(false)); // Gérer les erreurs et marquer le chargement comme terminé
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [selectedFilters]);

    const openDetail = (e) => {
        const permissionId = e.currentTarget.firstChild.textContent;
        navigate(`/permissions/${permissionId}`);
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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddFilter();
        }
    };

    return (
        <div className="container-page">
            <Header />
            <div className="permissions__container-page">
                <div className='top__header-page'>
                    <a href="/home">
                        <img className='back__button' src={back} />
                    </a>
                    <h1 className='m-0'>Liste des Permissions</h1>
                    <div className='m__initial' onClick={handleCreatePermission}>
                        <img className='add__button' src={ticket_img} />
                    </div>
                </div>
                <div className='top-section-container'>
                    <div className="filter-container">
                        <div className='input-group input__group__block'>
                            <label>Catégorie </label>
                            <select className="input__select" value={filterField} onChange={handleFilterFieldChange}>
                                <option value="id">ID</option>
                                <option value="libelle">Libellé</option>
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
                            <button className='input__button' onClick={handleAddFilter}>Ajouter</button>
                        </div>
                    </div>
                </div>
                {selectedFilters.length > 0 && (
                    <div className="top-section-container">
                        <div className="filter-container j__start">
                            {selectedFilters.map((filter, index) => (
                                <div key={index} className="filter-item">
                                    <span>{filter.field}: {filter.value}</span>
                                </div>
                            ))}
                            <button className='input__button m__initial' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                        </div>
                    </div>)}
                <div className='table-container'>
                    <div className="table">
                        {isLoading ? ( // Vérifier si le chargement est en cours
                            <p className='t__center'>Chargement des permissions...</p>
                        ) : permissions.length === 0 ? (
                            <p className='t__center'>Pas de permissions</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Libellé</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map(permission => (
                                        <tr className='pointer' onClick={openDetail} key={permission._id}>
                                            <td>{permission._id}</td>
                                            <td>{permission._libelle}</td>
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

export default Permissions;