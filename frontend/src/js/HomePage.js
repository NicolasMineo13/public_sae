import React from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';


function HomePage() {

    const { isLoggedIn, logout } = useAuth();

    isLoggedIn();

    return (
        <div className='container-page'>
            <Header />
        </div>
    );
}

export default HomePage;