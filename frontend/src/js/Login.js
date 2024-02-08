import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/app.scss'
import API_BASE_URL from './config';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate(); // Ajout de la déclaration de navigate

    const handleLogin = async () => {
        const queryParams = new URLSearchParams({ login, password });
        const url = `${API_BASE_URL}/utilisateurs/login?${queryParams}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            // Mettre le token et le refresh token dans le local storage
            const { id, token, refreshtoken } = await response.json();
            localStorage.setItem('id', id);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshtoken', refreshtoken);

            navigate('/home');
        } catch (error) {
            setLoginError('Échec de la connexion. Veuillez réessayer.');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // L'utilisateur a appuyé sur Entrée, appelez handleLogin
            handleLogin();
        }
    };

    return (
        <div className="login__container">
            <h2>Connexion</h2>
            <div className="input-group">
                <label>Login</label>
                <input
                    className="input__text"
                    type="text"
                    placeholder="Login"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </div>
            <div className="input-group">
                <label>Mot de passe</label>
                <input
                    className="input__text"
                    type="password"
                    placeholder='Mot de passe'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </div>
            <button className='input__button' onClick={handleLogin}>Se connecter</button>
            {loginError && <p className="login__error-message">{loginError}</p>}
        </div>
    );
}

export default Login;