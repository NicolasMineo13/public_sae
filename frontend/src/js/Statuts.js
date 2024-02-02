import React, { useState, useEffect } from 'react';
import '../scss/app.scss'
import Header from './Header';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import add from '../assets/icons/add.svg';
import back from '../assets/icons/back.svg';

function Statuts() {
    const [statuts, setStatuts] = useState([]);
    const [filterField, setFilterField] = useState('id');
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    const navigate = useNavigate();

    const handleCreateStatut = () => {
        navigate('/statuts/create');
    };

    const { isLoggedIn } = useAuth();

    isLoggedIn();

    const fetchStatuts = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');
            let url = 'http://localhost:5000/statuts';

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
                throw new Error('Erreur lors de la récupération des statuts');
            }

            const data = await response.json();
            if (Array.isArray(data.statuts)) {
                setStatuts(data.statuts);
            } else {
                console.error('La réponse API ne renvoie pas un tableau de statuts:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des statuts:', error);
        }
    };

    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement

    useEffect(() => {
        fetchStatuts()
            .then(() => setIsLoading(false)) // Marquer le chargement comme terminé
            .catch(() => setIsLoading(false)); // Gérer les erreurs et marquer le chargement comme terminé
    }, []);

    useEffect(() => {
        fetchStatuts();
    }, [selectedFilters]);

    const openDetail = (e) => {
        const statutId = e.currentTarget.firstChild.textContent;
        navigate(`/statuts/${statutId}`);
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
            <div className="tickets__container-page">
                <div className='top__header-page'>
                    <a href="/home">
                        <img className='back__button' src={back} />
                    </a>
                    <h1 className='m-0'>Liste des Statuts</h1>
                    <div className='m__initial' onClick={handleCreateStatut}>
                        <img className='add__button' src={add} />
                    </div>
                </div>
                <div className='tickets__top-section-container'>
                    <div className="tickets__filter-container">
                        <div className='input-group input__group__block'>
                            <label>Catégorie </label>
                            <select className="input__select" value={filterField} onChange={handleFilterFieldChange}>
                                <option value="id">ID</option>
                                <option value="libelle">Libellé</option>
                                <option value="couleur">Couleur</option>
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
                    <div className="tickets__top-section-container">
                        <div className="tickets__filter-container j__start">
                            {selectedFilters.map((filter, index) => (
                                <div key={index} className="tickets__filter-item">
                                    <span>{filter.field}: {filter.value}</span>
                                </div>
                            ))}
                            <button className='input__button m__initial' onClick={() => setSelectedFilters([])}>Effacer les filtres</button>
                        </div>
                    </div>)}
                <div className='tickets__table-container'>
                    <div className="tickets__table">
                        {isLoading ? ( // Vérifier si le chargement est en cours
                            <p className='t__center'>Chargement des statuts...</p>
                        ) : statuts.length === 0 ? (
                            <p className='t__center'>Pas de statuts</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Libellé</th>
                                        <th>Couleur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statuts.map(statut => (
                                        <tr className='pointer' onClick={openDetail} key={statut._id}>
                                            <td>{statut._id}</td>
                                            <td>{statut._libelle}</td>
                                            <td>
                                                <span>
                                                    {statut._couleur}
                                                </span>
                                                {statut._couleur && (
                                                    <div
                                                        style={{
                                                            marginLeft: '1vh', /* Espacement entre le texte et le carré */
                                                            verticalAlign: 'middle', /* Pour centrer verticalement */
                                                            width: '20px', /* Largeur du carré */
                                                            height: '20px', /* Hauteur du carré */
                                                            backgroundColor: statut._couleur, /* Utilisez la couleur récupérée de l'API */
                                                            display: 'inline-flex', /* Pour centrer verticalement */
                                                            alignItems: 'center', /* Pour centrer verticalement */
                                                            justifyContent: 'center', /* Pour centrer horizontalement */
                                                            marginRight: '5px', /* Espacement entre le carré et le texte */
                                                            border: '1px solid #000', /* Bordure d'1 pixel solide noire */
                                                            opacity: 0.5, /* Opacité de 50% */
                                                        }}
                                                    ></div>
                                                )}
                                            </td>
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

export default Statuts;