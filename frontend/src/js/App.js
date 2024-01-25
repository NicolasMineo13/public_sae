import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; // Assurez-vous d'avoir ce composant
import Login from './Login'; // Votre composant de connexion
import Tickets from './Tickets'; // Votre composant de tickets
import CreateTicket from './CreateTicket'; // Votre composant de création de ticket
import Utilisateurs from './Utilisateurs'; // Votre composant d'utilisateurs
import CreateUtilisateur from './CreateUtilisateur'; // Votre composant de création d'utilisateur
import { AuthProvider } from './AuthContext'; // Importez le AuthProvider ici

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/tickets" element={<Tickets />} />
					<Route path="/tickets/create" element={<CreateTicket />} />
					<Route path="/utilisateurs" element={<Utilisateurs />} />
					<Route path="/utilisateurs/create" element={<CreateUtilisateur />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;