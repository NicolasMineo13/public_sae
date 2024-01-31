import React from 'react';
import { useAuth } from './AuthContext'; // Importez le hook useAuth
import Header from './Header'; // Importez le composant Header


function HomePage() {

    const { isLoggedIn, logout } = useAuth(); // Utilisez le hook useAuth pour obtenir la fonction

    isLoggedIn();

    return (
        <div>
            <Header />
        </div>
    );
}

export default HomePage;