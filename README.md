# FR

# Gestionnaire de Tickets

## Objectif

Le Gestionnaire de Tickets est une application conçue pour simplifier et rationaliser le processus de gestion des tickets en entreprise. Les tickets peuvent représenter diverses demandes, problèmes ou tâches à résoudre, et cette application fournit une plateforme centralisée pour les suivre, les gérer et les résoudre efficacement.

### Utilités d'un Gestionnaire de Tickets en Entreprise

- **Suivi des Demandes :** Permet de garder une trace de toutes les demandes des utilisateurs ou des incidents signalés, assurant ainsi qu'aucun problème n'est négligé.
- **Priorisation des Tâches :** Les tickets peuvent être attribués à des niveaux de priorité, aidant ainsi à identifier et à traiter les problèmes les plus critiques en premier.
- **Collaboration et Communication :** Offre un moyen centralisé pour les équipes de collaborer sur la résolution des problèmes, en permettant des commentaires, des mises à jour et des discussions autour de chaque ticket.
- **Amélioration de la Productivité :** En fournissant une structure claire pour gérer les tâches et les problèmes, l'efficacité opérationnelle est accrue, ce qui se traduit par une meilleure productivité globale.
- **Suivi des Performances :** Permet d'évaluer les performances de l'équipe de support ou de service en suivant les délais de résolution, la satisfaction client, etc.

## Technologies Utilisées

### Backend

- **API Rest via Node.js et Express :** Pour la création d'une API robuste permettant la communication entre le frontend et la base de données.
- **Base de données MySQL :** Pour stocker les informations sur les tickets, les utilisateurs, les rôles, les statuts, etc.
- **JSON Web Tokens (JWT) :** Utilisés pour sécuriser l'accès aux ressources de l'application.
- **Système de Refresh Token :** Pour assurer une authentification continue et sécurisée des utilisateurs.

### Frontend

- **React et Node.js :** Pour la création d'une interface utilisateur dynamique et réactive.
- **SCSS :** Utilisé pour la stylisation avancée des composants UI.
- **Swagger :** Utilisé pour documenter l'API backend, facilitant ainsi son utilisation et son intégration.

### Versioning

- **Git :** Utilisé pour le versioning du code source, permettant un suivi précis des modifications et une collaboration efficace entre les développeurs.

## Fonctionnalités Actuelles de l'Application

- **Interface de Connexion :** Permet aux utilisateurs de s'authentifier pour accéder à l'application.
- **Page d'Accueil et Header :** Fournit une vue d'ensemble et une navigation intuitive à travers l'application.
- **CRUD (Create, Read, Update, Delete) des Tickets, Utilisateurs, Rôles, Statuts et Permissions :** Permet la gestion complète des entités clés de l'application.
- **Réponses, Solutions et Clôture des Tickets :** Permet aux utilisateurs de répondre aux tickets, de proposer des solutions et de clôturer les tickets une fois résolus.

## Déploiement et explications plus détaillées

### Frontend

Le frontend de l'application est développé en React et Node.js, offrant une interface utilisateur intuitive et réactive pour interagir avec le backend.

#### Fonctionnement du Frontend

Le frontend communique avec le backend via une API REST pour récupérer et manipuler les données des tickets, des utilisateurs et d'autres entités. Il offre une interface utilisateur conviviale pour créer, afficher, mettre à jour et supprimer des tickets, ainsi que pour gérer les utilisateurs, les rôles et les autorisations.

#### Déploiement Local du Frontend

Pour déployer le frontend localement, suivez ces étapes :

1. Clonez ce dépôt Git depuis [https://github.com/NicolasMineo13/public_sae.git](https://github.com/NicolasMineo13/public_sae.git).
2. Assurez-vous d'avoir Node.js installé sur votre machine.
3. Dans le répertoire du **frontend**, exécutez la commande suivante pour installer les dépendances :

   ```
   npm install
   ```
4. Une fois l'installation des dépendances terminée, lancez l'application avec la commande :

   ```
   npm start
   ```
5. Le frontend devrait s'ouvrir tout seul dans votre navigateur, si ce n'est pas le cas il doit être accessible à l'adresse [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Backend

Le backend de l'application est développé en Node.js avec Express, utilisant une base de données MySQL pour stocker les données des tickets, des utilisateurs et d'autres entités.

### Déploiement Local du Backend

Pour déployer le backend localement, suivez ces étapes :

1. Clonez ce dépôt Git si ce n'est pas déjà fait, depuis [https://github.com/NicolasMineo13/public_sae.git](https://github.com/NicolasMineo13/public_sae.git).
2. Assurez-vous d'avoir Node.js installé sur votre machine.
3. Dans le répertoire du **backend**, exécutez la commande suivante pour installer les dépendances :

   ```
   npm install
   ```
4. Une fois l'installation des dépendances terminée, lancez le serveur avec la commande :

   ```
   npm start
   ```
5. Le backend devrait maintenant être accessible à l'adresse [http://localhost:5000](http://localhost:port) dans votre navigateur.

## Prochaines Étapes

- **Gestion des Permissions :** Implémenter un système de gestion des permissions plus robuste pour contrôler l'accès aux fonctionnalités de l'application.
- **Rendre l'Application Responsive :** Optimiser l'interface utilisateur pour qu'elle s'adapte à différents appareils et tailles d'écran.
- **Ajouter le Système de Priorité des Tickets :** Mettre en place un système permettant d'attribuer des niveaux de priorité aux tickets, facilitant ainsi la gestion des problèmes critiques.
- **Création des Catégories de Tickets :** Introduire la possibilité de catégoriser les tickets en fonction de leur type (ex. : technique, administratif, support client, etc.), ce qui simplifiera leur gestion et leur traitement.
- **Correction des Bugs et des Duplications de Code :** Modifier le comportement de l'application pour afficher des messages d'erreur explicites à la place des logs en cas d'échec des opérations ou d'erreurs de validation.
- **Affichage des messages d'erreur** : Actuellement tous les messages d'erreurs dans la console, j'aimerais faire de vrais messages pour indiquer à l'utilisateur ce qui ne va pas.

---

# EN

# Ticket Management System

## Purpose

The Ticket Management System is an application designed to simplify and streamline the ticket management process in a business environment. Tickets can represent various requests, issues, or tasks to be resolved, and this application provides a centralized platform to track, manage, and resolve them efficiently.

### Benefits of a Ticket Management System in a Business

* **Request Tracking:** Keeps track of all user requests or reported incidents, ensuring that no issue is overlooked.
* **Task Prioritization:** Tickets can be assigned priority levels, helping identify and address the most critical issues first.
* **Collaboration and Communication:** Provides a centralized way for teams to collaborate on issue resolution, allowing comments, updates, and discussions for each ticket.
* **Improved Productivity:** By providing a clear structure for managing tasks and issues, operational efficiency is increased, leading to higher overall productivity.
* **Performance Tracking:** Enables evaluation of the support or service team’s performance by monitoring resolution times, customer satisfaction, etc.

## Technologies Used

### Backend

* **REST API with Node.js and Express:** For creating a robust API to facilitate communication between the frontend and the database.
* **MySQL Database:** Stores information about tickets, users, roles, statuses, etc.
* **JSON Web Tokens (JWT):** Used to secure access to application resources.
* **Refresh Token System:** Ensures continuous and secure user authentication.

### Frontend

* **React and Node.js:** For building a dynamic and responsive user interface.
* **SCSS:** Used for advanced UI component styling.
* **Swagger:** Used to document the backend API, making it easier to use and integrate.

### Version Control

* **Git:** Used for source code versioning, enabling precise tracking of changes and effective collaboration among developers.

## Current Application Features

* **Login Interface:** Allows users to authenticate to access the application.
* **Homepage and Header:** Provides an overview and intuitive navigation throughout the application.
* **CRUD (Create, Read, Update, Delete) for Tickets, Users, Roles, Statuses, and Permissions:** Enables full management of key application entities.
* **Ticket Responses, Solutions, and Closure:** Allows users to respond to tickets, propose solutions, and close tickets once resolved.

## Deployment and Detailed Instructions

### Frontend

The frontend is built with React and Node.js, providing an intuitive and responsive interface for interacting with the backend.

#### How the Frontend Works

The frontend communicates with the backend via a REST API to retrieve and manipulate ticket, user, and other entity data. It provides a user-friendly interface to create, view, update, and delete tickets, as well as manage users, roles, and permissions.

#### Local Frontend Deployment

To deploy the frontend locally, follow these steps:

1. Clone this Git repository from [https://github.com/NicolasMineo13/public\_sae.git](https://github.com/NicolasMineo13/public_sae.git).
2. Make sure Node.js is installed on your machine.
3. In the **frontend** directory, run the following command to install dependencies:

   ```
   npm install
   ```
4. Once dependencies are installed, start the application with:

   ```
   npm start
   ```
5. The frontend should automatically open in your browser; if not, it can be accessed at [http://localhost:3000](http://localhost:3000).

### Backend

The backend is developed using Node.js with Express and uses a MySQL database to store ticket, user, and other entity data.

#### Local Backend Deployment

To deploy the backend locally, follow these steps:

1. Clone this Git repository (if not already done) from [https://github.com/NicolasMineo13/public\_sae.git](https://github.com/NicolasMineo13/public_sae.git).
2. Ensure Node.js is installed on your machine.
3. In the **backend** directory, run the following command to install dependencies:

   ```
   npm install
   ```
4. Once dependencies are installed, start the server with:

   ```
   npm start
   ```
5. The backend should now be accessible at [http://localhost:5000](http://localhost:5000).

## Next Steps

* **Permissions Management:** Implement a more robust permissions system to control access to application features.
* **Make the Application Responsive:** Optimize the UI to adapt to different devices and screen sizes.
* **Add Ticket Priority System:** Introduce a system to assign priority levels to tickets, making critical issue management easier.
* **Create Ticket Categories:** Allow tickets to be categorized by type (e.g., technical, administrative, customer support, etc.) for easier management and handling.
* **Bug Fixes and Code Deduplication:** Update the application to display explicit error messages instead of console logs when operations fail or validation errors occur.
* **Error Message Display:** Currently, all error messages appear in the console; the goal is to show clear messages to inform the user of what went wrong.

