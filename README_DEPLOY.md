# Plateforme INNID BOOKING — V1

Plateforme moderne de réservation et de gestion de salles de réunion, bureaux privés et espaces de coworking pour **INNID**.

---

## 🎨 Charte Graphique & Identité Visuelle INNID
- **Vert foncé INNID** : `#064E3B`
- **Orange INNID** : `#F59E0B`
- **Blanc** : `#FFFFFF`
- **Code couleur des statuts** :
  - 🟢 **Disponible (Libre)** : `#10B981` (Vert)
  - 🔴 **Confirmée** : `#EF4444` (Rouge)
  - 🟠 **En attente** : `#F59E0B` (Orange)
  - ⚪ **Annulée** : `#6B7280` (Gris)

---

## 🛡️ Sécurité Anti-Chevauchement (Cœur de Sécurité)

Le système applique côté serveur un blocage systématique de tout conflit d'horaires :

```sql
SELECT *
FROM reservations
WHERE salle_id = ?
AND date = ?
AND statut != 'Annulée'
AND (
 heure_debut < nouvelle_heure_fin
 AND heure_fin > nouvelle_heure_debut
);
```

Si un enregistrement concurrent est détecté :
```
⚠️ SALLE DÉJÀ RÉSERVÉE
Cette salle est occupée de 10:00 à 12:00 par Sara Mansouri.
Impossible de contourner par l'interface.
```

---

## 📂 Structure du Projet

```text
innid-booking/
│
├── backend/
│   └── server.ts              # Serveur backend Node.js + Express
├── database/
│   └── schema.sql             # Schéma PostgreSQL (Tables clients, salles, réservations, index)
├── package.json
└── vite.config.ts
```

---

## 🚀 Options de Déploiement

### Option 1 : Déploiement Professionnel (Serveur VPS + PostgreSQL)

1. **Prérequis** : Serveur Ubuntu 22.04 LTS ou Debian avec accès SSH.
2. **Installation de Node.js et PostgreSQL** :
   ```bash
   sudo apt update && sudo apt install -y nodejs npm postgresql postgresql-contrib git
   ```
3. **Configuration de PostgreSQL** :
   ```bash
   sudo -u postgres psql
   CREATE DATABASE innid_db;
   CREATE USER innid_user WITH ENCRYPTED PASSWORD 'mot_de_passe_securise';
   GRANT ALL PRIVILEGES ON DATABASE innid_db TO innid_user;
   \q
   ```
4. **Charger le schéma de la base de données** :
   ```bash
   psql -U innid_user -d innid_db -f database/schema.sql
   ```
5. **Cloner et démarrer le serveur** :
   ```bash
   git clone <URL_DU_DEPOT> innid-booking
   cd innid-booking
   npm install
   npm run build
   # Démarrage avec PM2 pour redémarrage automatique
   sudo npm install -g pm2
   pm2 start server.ts --name "innid-booking"
   pm2 save
   pm2 startup
   ```
6. **Configurer Nginx avec HTTPS Let's Encrypt** pour pointer votre nom de domaine (ex: `booking.innid.com`) vers le port 3000.

---

### Option 2 : Déploiement Simple (Ordinateur Réception INNID)

1. Installer Node.js LTS (https://nodejs.org) sur l'ordinateur de l'accueil.
2. Décompresser le projet dans un dossier `C:\INNID-BOOKING` ou `~/innid-booking`.
3. Ouvrir un terminal dans ce dossier et exécuter :
   ```bash
   npm install
   npm run build
   npx tsx backend/server.ts
   ```
4. Ouvrir votre navigateur sur :
   - Sur le poste même : `http://localhost:3000`
   - Depuis les autres appareils connectés au Wi-Fi INNID : `http://<IP_DE_L_ORDINATEUR>:3000`
