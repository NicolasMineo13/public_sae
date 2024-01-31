import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Roles() {
    const [roles, setRoles] = useState([]);
    const [filterField, setFilterField] = useState('id');
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const navigate = useNavigate();

    const handleCreateRole = () => {
        navigate('/roles/create');
    };

    const { isLoggedIn } = useAuth();

    isLoggedIn();

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            let url = 'http://localhost:5000/roles';

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
                throw new Error('Erreur lors de la récupération des roles');
            }

            const data = await response.json();
            console.log(data);
            if (Array.isArray(data.roles)) {
                setRoles(data.roles);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de roles:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des roles:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, [selectedFilters]);

    const openDetail = (e) => {
        const roleId = e.currentTarget.firstChild.textContent;
        navigate(`/roles/${roleId}`);
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

    return (
        <div className="home__container">
            <Header />
            <div className="tickets__container-page">
                <div className='top__header-page'>
                    <Link to='/home' className='tickets__back-button'>
                        <FontAwesomeIcon icon={faArrowLeft} className='me-2' />
                    </Link>
                    <h1 className='m-0'>Liste des Roles</h1>
                    <button className='input__button m__initial' onClick={handleCreateRole}>+</button>
                </div>
                <div className='tickets__top-section-container'>
                    <div className="tickets__filter-container">
                        <div className='input-group'>
                            <label>Catégorie </label>
                            <select className="input__select" value={filterField} onChange={handleFilterFieldChange}>
                                <option value="id">ID</option>
                                <option value="titre">Titre</option>
                                <option value="description">Description</option>
                                <option value="date_creation">Date de création</option>
                                <option value="id_utilisateur_demandeur">Demandeur</option>
                                <option value="id_utilisateur_technicien">Technicien</option>
                                <option value="id_statut">Statut</option>
                                <option value="date_derniere_modif">Date de Modification</option>
                                <option value="date_cloture">Date de clôture</option>
                            </select>
                        </div>
                        <div className='input-group'>
                            <label>Recherche</label>
                            <input className="input__text" type="text" placeholder="Valeur de filtre..." value={filterValue} onChange={handleFilterValueChange} />
                        </div>
                        <div className='input-group'>
                            <button className='input__button' onClick={handleAddFilter}>Ajouter</button>
                            <button className='input__button' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                        </div>
                    </div>
                </div>
                <div className="tickets__top-section-container">
                    <div className="tickets__filter-container j__start">
                        {selectedFilters.map((filter, index) => (
                            <div key={index} className="tickets__filter-item">
                                <span>{filter.field}: {filter.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='tickets__table-container'>
                    <div className="tickets__table">
                        {roles.length === 0 ? (
                            <p className='t__center'>Pas de roles</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Libellé</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map(role => (
                                        <tr className='pointer' onClick={openDetail} key={role._id}>
                                            <td>{role._id}</td>
                                            <td>{role._libelle}</td>
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

export default Roles;