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
