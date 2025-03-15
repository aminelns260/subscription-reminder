# Subscription Reminder App

## Description
Cette application est un système de rappel d'abonnement qui envoie des notifications aux utilisateurs avant la date de renouvellement de leur abonnement. Elle utilise **Node.js**, **Express**, **MongoDB**, et **Upstash** pour la gestion des rappels programmés.

## Fonctionnalités
- Gestion des abonnements des utilisateurs
- Envoi automatique d'e-mails de rappel avant l'expiration d'un abonnement
- Configuration des rappels à différents intervalles (7, 5, 2 et 1 jour avant l'expiration)
- Support des environnements **développement** et **production**
- Stockage sécurisé des informations sensibles via des fichiers `.env`

---

## Installation et Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/aminelns260/subscription-reminder.git
cd subscription-reminder
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Créer un fichier `.env.development.local` ou `.env.production.local` et y ajouter les variables d'environnement nécessaires.

Exemple pour le développement :
```ini
PORT=5555
SERVER_URL="http://localhost:5500"
NODE_ENV='development'
DB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
JWT_SECRET="secret"
JWT_EXPIRES_IN="1d"
ARCJET_KEY=ajkey_XXXXXXXXX
ARCJET_ENV='development'
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=eyJVc7VySUQiOiJkZWZhdWx9VXNlciIsIlBhc3N4a3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0=
EMAIL_PASSWORD="votre_mot_de_passe"
```

### 4. Lancer l'application

#### En mode développement
```bash
npm run dev
```

#### En mode production
```bash
npm run start
```

---

## Fonctionnement de l'application

### Structure des fichiers principaux
- **`app.js`** : Point d'entrée du serveur Express
- **`env.js`** : Configuration des variables d'environnement
- **`models/subscription.model.js`** : Modèle d'abonnement MongoDB
- **`utils/send-emails.js`** : Fonction pour envoyer les e-mails de rappel
- **`routes/subscription.routes.js`** : Routes API pour la gestion des abonnements
- **`controllers/subscription.controller.js`** : Logique métier pour la gestion des abonnements

### Processus d'envoi des rappels
1. L'utilisateur souscrit à un abonnement.
2. L'application récupère la date de renouvellement.
3. À J-7, J-5, J-2 et J-1, un rappel est programmé via Upstash QStash.
4. Un e-mail est envoyé à l'utilisateur si la date du rappel correspond à la date actuelle.

---

## Technologies utilisées
- **Node.js** + **Express** (Backend API)
- **MongoDB** (Base de données)
- **Day.js** (Gestion des dates)
- **Upstash** (Programmation des rappels)
- **Nodemailer** (Envoi d'e-mails)

---

## Déploiement
L'application peut être déployée sur **Vercel**, **Railway**, **Heroku**, ou tout autre hébergeur Node.js.
