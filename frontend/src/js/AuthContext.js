import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from './config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = async () => {
        if (location.pathname !== '/' && location.pathname !== '/docs') {
            try {
                const token = localStorage.getItem('token');
                const refreshToken = localStorage.getItem('refreshtoken');

                if (!token || !refreshToken) {
                    navigate('/');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/verifyToken`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        'Refresh-Token': refreshToken
                    },
                });

                if (!response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshtoken');
                    localStorage.removeItem('id');
                    navigate('/');
                }

                const data = await response.json();

                if (data.status === true) {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }
                    return true;
                } else {
                    throw new Error('Token expiré !.');
                }
            } catch (error) {
                console.error('Erreur lors de la requête:', error.message);
                return false;
            }
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const logout = async () => {
        try {
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            const response = await fetch(`${API_BASE_URL}/utilisateurs/logout/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('token');
            localStorage.removeItem('refreshtoken');
            localStorage.removeItem('id');
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};