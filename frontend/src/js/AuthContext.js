import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, navigate }) => { // Ajoutez navigate comme prop

    const isLoggedIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshtoken');

            // console.log('Token:', token);
            // console.log('Refresh token:', refreshToken);

            const response = await fetch(`http://localhost:5000/verifyToken`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                    'Refresh-Token': refreshToken
                },
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('id');
                navigate('/'); // Utilisez la fonction navigate ici
                return response.json().then((err) => {
                    throw new Error(err.error);
                });
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
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};