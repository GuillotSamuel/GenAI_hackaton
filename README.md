# 📌 Fichotron - AI

Fichotron - AI est une application web destinée à automatiser la génération de fiches clients pour SFIL. Ce projet permet de fusionner des données publiques issues de sources telles que data.gouv ou Wikipédia avec des données internes pour produire une fiche client standardisée, précise, complète et modifiable. L'interface utilisateur adopte un design minimaliste, moderne et responsive, offrant une expérience fluide et intuitive.

## Table des matières

- [📌 Fichotron - AI](#-fichotron---ai)
  - [Table des matières](#table-des-matières)
  - [Fonctionnalités](#fonctionnalités)
  - [Technologies utilisées](#technologies-utilisées)
  - [Installation et exécution](#installation-et-exécution)
    - [Installation locale](#installation-locale)
    - [Exécution](#exécution)
    - [🖥️ Déploiement](#️-déploiement)
  - [🏗️ Structure du projet](#️-structure-du-projet)
    - [🛠️ Technologies Utilisées](#️-technologies-utilisées)
  - [🎯 Objectifs et Critères de Succès](#-objectifs-et-critères-de-succès)
  - [Contributions](#contributions)
  - [Licence](#licence)
  - [🚀 Réalisé par la LLaMazing Team](#-réalisé-par-la-llamazing-team)

## Fonctionnalités

- **Génération de fiches clients :** 
  - Fusion de données publiques et internes pour générer une fiche client en format Word.
  - Interface moderne et intuitive pour saisir le nom de la ville ou du département.
  
- **Recherche intelligente :**
  - Suggestions de résultats organisées en trois catégories : Régions, Départements et Communes.
  - Filtrage basé sur les caractères de début du mot avec normalisation (gestion des accents et des tirets).

- **Bouton d'importation :**
  - Permet aux utilisateurs d'importer des fichiers de données via un bouton au même style que le bouton "Générer".

- **UI/UX responsive :**
  - Design minimaliste et moderne, adapté à tous types d'écrans (smartphones, tablettes, ordinateurs).
  - Effets d'animation et de transition fluides (hover, focus, scroll).

- **Autres éléments :**
  - Bouton "Retour en haut" pour améliorer la navigation sur la page.

### Scrapping amélioré proto
Un prototype de code de scrapping amélioré se trouve dans le folder Scrapping_impr.
Le scrapping recherche les urls pertinents en fonction d'une liste de thèmes prédéfinis tels que le financement ou de l'écologie.
  
## Technologies utilisées

- **🖥️ Front-end :**
  - HTML5
  - CSS3 (avec utilisation de variables CSS pour le thème)
  - JavaScript (ES6)
  
- **Déploiement et hébergement :**
  - AWS S3 (pour l'hébergement statique)
  - AWS CloudFront (pour la distribution en CDN et la gestion du cache)

## Installation et exécution

### Installation locale

1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo.git

    2.	Naviguez dans le dossier du projet :

cd votre-repo


    3.	Ouvrez le fichier index.html dans votre navigateur ou utilisez un serveur local (par exemple, avec Live Server dans VSCode).

### Exécution

Le projet est entièrement statique. Une fois cloné, il suffit d’ouvrir index.html dans un navigateur moderne pour visualiser l’application.

### 🖥️ Déploiement

Pour déployer le site sur AWS S3 et CloudFront :
    1.	Hébergement S3 :
    •	Mettez à jour votre bucket S3 avec les fichiers du projet (HTML, CSS, JS, images, etc.).
    •	Utilisez l’AWS CLI pour synchroniser le contenu, par exemple :

aws s3 sync ./ s3://votre-bucket --delete
    2.	CloudFront :
    •	Configurez une distribution CloudFront pointant vers votre bucket S3.
    •	Effectuez une invalidation du cache pour rafraîchir les contenus après chaque déploiement :

aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
    3.	Automatisation (optionnel) :
    •	Utilisez GitHub Actions pour automatiser le déploiement à chaque push sur la branche principale.

## 🏗️ Structure du projet

/votre-repo
├── index.html
├── style.css
├── script.js
├── /img
│   ├── full-bg.jpg         # Image de fond pour toute la page
│   ├── hero-bg.jpg         # Image de fond pour la section hero
│   ├── logo.png            # Logo de l'application
│   └── sfil_ico.ico        # Favicon
└── /data
    └── v_commune_2024.csv  # Fichier CSV utilisé pour la recherche

### 🛠️ Technologies Utilisées
- AWS Amplify (Hébergement Frontend)
- AWS API Gateway (Récupération des collectivités)
- AWS Lambda (Traitement automatisé des données)
- DynamoDB (Stockage des liens)
- AWS S3 (Stockage des résultats de scraping)
- AWS Bedrock (Génération de contenu)

## 🎯 Objectifs et Critères de Succès
- ✅ Automatisation complète du processus de génération des fiches
- ✅ Exactitude et complétude des informations collectées
- ✅ Comparaison avec les fiches créées manuellement
- ✅ Optimisation continue grâce aux retours d'expérience

## Contributions

Les contributions sont les bienvenues !
Si vous souhaitez contribuer à ce projet, veuillez soumettre une pull request avec vos améliorations ou corrections. Assurez-vous de suivre les bonnes pratiques de codage et de respecter le style existant.

## Licence

Ce projet est sous licence MIT.
(Vous pouvez adapter cette section selon la licence choisie.)

## 🚀 Réalisé par la LLaMazing Team

Ce projet a été conçu et développé par la LLaMazing Team, une équipe passionnée par l'innovation et l'automatisation des processus. Nous avons mis en place une solution robuste et évolutive pour optimiser la gestion des fiches clients SPL.