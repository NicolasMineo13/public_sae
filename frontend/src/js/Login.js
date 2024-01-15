import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate(); // Ajout de la déclaration de navigate

    const handleLogin = async () => {
        // Construire l'URL avec les paramètres de requête
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
        <div className="login-container">
            <h2>Page de Connexion</h2>
            <div className="input-group">
                <label>Nom d'utilisateur:</label>
                <input type="text" value={login} onChange={e => setLogin(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Mot de passe:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin}>Se Connecter</button>
            {loginError && <p className="error-message">{loginError}</p>}
        </div>
    );
}

export default Login;