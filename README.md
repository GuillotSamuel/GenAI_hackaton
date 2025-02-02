# 📌 README - Automatisation des Fiches Clients SPL

## 🌍 Contexte du Projet
L'objectif de ce projet est de simplifier et automatiser la création des fiches clients SPL en agrégeant des données issues de sources publiques (collectivités, Wikipedia, actualités) et internes. Grâce à notre solution, nous réduisons le travail manuel et améliorons la précision des fiches générées.

## 🏗️ Architecture de la Solution
Nous avons mis en place une infrastructure robuste en exploitant les services AWS pour garantir une automatisation fluide et efficace.

## 🖥️ Frontend
- Hébergé via AWS Amplify
- Interface intuitive permettant la recherche et la récupération des fiches

## 🔎 Collecte des Données
API Gateway pour récupérer le nom de la collectivité recherchée.
Lambda Function pour extraire 5 liens pertinents à partir des sources publiques.
DynamoDB pour stocker ces liens de manière structurée.

## 📊 Traitement et Génération
1. Lambda Function pour interroger DynamoDB et récupérer les liens stockés.
2. S3 Bucket pour stocker les résultats du scraping.
3. Lambda Function pour segmenter les données (chunking) et les envoyer vers la knowledge base.
4. API AWS Bedrock pour générer les fiches basées sur les données collectées.
5. Trigger Lambda qui génère automatiquement les fichiers JSON, CSV et DOCX lorsque la knowledge base est prête.
6. Transmission vers le Frontend, permettant aux utilisateurs de télécharger leur fiche DOCX.

## 🎯 Objectifs et Critères de Succès
- ✅ Automatisation complète du processus de génération des fiches
- ✅ Exactitude et complétude des informations collectées
- ✅ Comparaison avec les fiches créées manuellement
- ✅ Optimisation continue grâce aux retours d'expérience

## 🚀 Améliorations Futures
- 🔍 Affinage des algorithmes pour mieux sélectionner les sources d'information
- 🔗 Intégration d'autres sources pour enrichir les fiches générées

## 🛠️ Technologies Utilisées
- AWS Amplify (Hébergement Frontend)
- AWS API Gateway (Récupération des collectivités)
- AWS Lambda (Traitement automatisé des données)
- DynamoDB (Stockage des liens)
- AWS S3 (Stockage des résultats de scraping)
- AWS Bedrock (Génération de contenu)

## 🚀 Réalisé par la LLaMazing Team

Ce projet a été conçu et développé par la LLaMazing Team, une équipe passionnée par l'innovation et l'automatisation des processus. Nous avons mis en place une solution robuste et évolutive pour optimiser la gestion des fiches clients SPL.

