import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SwaggerDocs from './SwaggerDocs'; // Assurez-vous d'avoir ce composant
import HomePage from './HomePage'; // Assurez-vous d'avoir ce composant
import Login from './Login'; // Votre composant de connexion
import Tickets from './Tickets'; // Votre composant de tickets
import CreateTicket from './CreateTicket'; // Votre composant de création de ticket
import DetailTicket from './DetailTicket'; // Votre composant de détail de ticket
import Utilisateurs from './Utilisateurs'; // Votre composant d'utilisateurs
import CreateUtilisateur from './CreateUtilisateur'; // Votre composant de création d'utilisateur
import DetailUtilisateur from './DetailUtilisateur'; // Votre composant de détail de l'utilisateur
import Roles from './Roles'; // Votre composant du role
import CreateRole from './CreateRole'; // Votre composant de création du role
import DetailRole from './DetailRole'; // Votre composant de détail de role
import Permissions from './Permissions'; // Votre composant du role
import CreatePermission from './CreatePermission'; // Votre composant de création du role
import DetailPermission from './DetailPermission'; // Votre composant de détail de role
import Statuts from './Statuts'; // Votre composant du role
import CreateStatut from './CreateStatut'; // Votre composant de création du role
import DetailStatut from './DetailStatut'; // Votre composant de détail de role
import CreateReponse from './CreateReponse'; // Votre composant de création de réponse
import { AuthProvider } from './AuthContext'; // Importez le AuthProvider ici

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/docs" element={<SwaggerDocs />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/tickets" element={<Tickets />} />
					<Route path="/tickets/create" element={<CreateTicket />} />
					<Route path="/tickets/:id" element={<DetailTicket />} />
					<Route path="/tickets/reponses/:id" element={<CreateReponse />} />
					<Route path="/tickets/solutions/:id" element={<CreateReponse />} />
					<Route path="/utilisateurs" element={<Utilisateurs />} />
					<Route path="/utilisateurs/create" element={<CreateUtilisateur />} />
					<Route path="/utilisateurs/:id" element={<DetailUtilisateur />} />
					<Route path="/roles" element={<Roles />} />
					<Route path="/roles/create" element={<CreateRole />} />
					<Route path="/roles/:id" element={<DetailRole />} />
					<Route path="/permissions" element={<Permissions />} />
					<Route path="/permissions/create" element={<CreatePermission />} />
					<Route path="/permissions/:id" element={<DetailPermission />} />
					<Route path="/statuts" element={<Statuts />} />
					<Route path="/statuts/create" element={<CreateStatut />} />
					<Route path="/statuts/:id" element={<DetailStatut />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;