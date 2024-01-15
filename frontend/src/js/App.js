import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './HomePage'; // Assurez-vous d'avoir ce composant
import Login from './Login'; // Votre composant de connexion

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/home" element={<HomePage />} />
			</Routes>
		</Router>
	);
}

export default App;