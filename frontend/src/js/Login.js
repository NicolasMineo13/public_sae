import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate(); // Ajout de la déclaration de navigate

    const handleLogin = async () => {
        const queryParams = new URLSearchParams({ login, password });
        const url = `http://localhost:5000/utilisateurs/login?${queryParams}`;

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

    return (
        <div className="login__container">
            <h2>Connexion</h2>
            <div className="login__input-group">
                <input type="text" placeholder="Login" value={login} onChange={e => setLogin(e.target.value)} />
            </div>
            <div className="login__input-group">
                <input type="password" placeholder='Mot de passe' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className='login__button' onClick={handleLogin}>Se Connecter</button>
            {loginError && <p className="login__error-message">{loginError}</p>}
        </div>
    );
}

export default Login;