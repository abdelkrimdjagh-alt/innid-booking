import React, { useState } from 'react';
import {
  ShieldCheck,
  Server,
  Database,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  HardDrive,
  Globe,
  Lock,
  Download,
  BookOpen,
} from 'lucide-react';
import { UserSession } from '../types';
import { resetDonneesExemple } from '../services/storage';

interface AdminDeployModalProps {
  userSession: UserSession;
  setUserSession: React.Dispatch<React.SetStateAction<UserSession>>;
  onDataReset: () => void;
}

const SQL_SCHEMA = `-- ==========================================================
-- INNID BOOKING - Schéma PostgreSQL & Données Initiales V1
-- ==========================================================

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL DEFAULT 10,
    description TEXT,
    statut VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (statut IN ('Active', 'Indisponible')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE SET NULL,
    client_nom VARCHAR(150) NOT NULL,
    client_telephone VARCHAR(30) NOT NULL,
    salle_id INT NOT NULL REFERENCES salles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    nombre_personnes INT NOT NULL DEFAULT 1,
    type VARCHAR(50) NOT NULL DEFAULT 'Réunion',
    statut VARCHAR(30) NOT NULL DEFAULT 'Confirmée' CHECK (statut IN ('Confirmée', 'En attente', 'Annulée')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RÈGLE ANTI-CONFLIT SERVEUR (Requête de vérification obligatoire avant INSERT)
-- SELECT * FROM reservations
-- WHERE salle_id = $1 AND date = $2 AND statut != 'Annulée'
-- AND (heure_debut < $nouvelle_fin AND heure_fin > $nouvelle_debut);`;

export const AdminDeployModal: React.FC<AdminDeployModalProps> = ({
  userSession,
  setUserSession,
  onDataReset,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [activeTab, setActiveTab] = useState<'vercel' | 'vps' | 'local' | 'sql'>('vercel');

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const bashScript = `# 1. Cloner et installer les dépendances
git clone https://github.com/innid/innid-booking.git
cd innid-booking
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL=postgresql://user:password@localhost:5432/innid_db

# 3. Initialiser la base de données PostgreSQL
psql -U postgres -d innid_db -f database/schema.sql

# 4. Compiler le frontend et lancer le serveur Express
npm run build
npx tsx backend/server.ts`;

  const handleCopyBash = () => {
    navigator.clipboard.writeText(bashScript);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous restaurer les données initiales de démonstration (08/09/2026 avec Ahmed, Sara, Karim) ?')) {
      resetDonneesExemple();
      onDataReset();
      alert('Données réinitialisées avec succès.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurité & Déploiement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
            ADMINISTRATION & DÉPLOIEMENT INNID
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Fichiers du projet, scripts d'installation VPS/Local et schéma de la base de données PostgreSQL
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center space-x-2 transition-colors self-start md:self-auto"
          title="Restaurer les données exemples de démonstration du 08/09/2026"
        >
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <span>Restaurer données démo</span>
        </button>
      </div>

      {/* Deployment Options Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-wrap border-b border-gray-200 gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`pb-3 px-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'vercel'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Globe className="w-4 h-4 text-[#F59E0B]" />
            <span>Option 1 : Vercel (Cloud Gratuit)</span>
          </button>

          <button
            onClick={() => setActiveTab('vps')}
            className={`pb-3 px-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'vps'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Server className="w-4 h-4 text-[#064E3B]" />
            <span>Option 2 : Serveur VPS (Ubuntu/Debian)</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`pb-3 px-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'local'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <HardDrive className="w-4 h-4 text-[#064E3B]" />
            <span>Option 3 : Réception Locale (PC INNID)</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'sql'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Database className="w-4 h-4 text-[#F59E0B]" />
            <span>Schéma PostgreSQL & Requêtes</span>
          </button>
        </div>

        {/* Option Vercel Guide & Error Resolution */}
        {activeTab === 'vercel' && (
          <div className="space-y-6 text-xs text-gray-700">
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200">
              <h3 className="text-sm font-bold text-[#064E3B] flex items-center space-x-2 mb-2">
                <Globe className="w-4 h-4 text-[#F59E0B]" />
                <span>Déploiement sur Vercel (Explication de l'erreur et résolution) :</span>
              </h3>
              <p className="text-emerald-950 font-medium leading-relaxed">
                Si votre lien Vercel (ex: <code className="bg-white/80 px-2 py-0.5 rounded font-mono font-bold text-gray-800">innid-booking-fm5rtuq0g-innid.vercel.app</code>) affiche une erreur 404, 500 ou de déploiement, voici les 3 causes fréquentes et comment les corriger en 1 minute :
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">Output Directory</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Sur Vercel, dans <strong>Settings ➔ Build & Development</strong>, assurez-vous que <strong>Output Directory</strong> est bien configuré sur <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono font-black text-emerald-800">dist</code> (et non vide ou public).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">Framework Preset</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Vérifiez que le preset est sélectionné sur <strong>Vite</strong>. La commande de build doit être <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono font-bold text-gray-800">npm run build</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">Protection Vercel</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Les liens temporaires avec un hash (<code className="font-mono text-[11px]">-fm5rtuq0g-</code>) sont protégés par <em>Vercel Authentication</em>. Utilisez le lien de production principal : <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono font-bold text-[#064E3B]">innid-booking.vercel.app</code>.
                </p>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl border border-gray-800 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
                <span>Fichier racine vercel.json (déjà généré dans votre projet) :</span>
                <span className="text-emerald-400 font-bold">✓ Actif</span>
              </div>
              <pre className="text-emerald-300">
{`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Option 1: VPS Guide */}
        {activeTab === 'vps' && (
          <div className="space-y-6 text-xs text-gray-700">
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <h3 className="text-sm font-bold text-[#064E3B] flex items-center space-x-2 mb-2">
                <Server className="w-4 h-4 text-[#F59E0B]" />
                <span>Architecture Cloud / VPS Recommandée :</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 font-medium text-emerald-950">
                <li><strong>Frontend :</strong> React + Vite déployé sur Vercel, Netlify ou servi directement par Express</li>
                <li><strong>Backend :</strong> Serveur Node.js / Express sur VPS (Ubuntu 22.04 LTS / Debian) avec gestionnaire PM2</li>
                <li><strong>Base de données :</strong> PostgreSQL 15+ avec pool de connexions sécurisées SSL</li>
                <li><strong>Reverse Proxy :</strong> Nginx avec certificat HTTPS Let's Encrypt automatique</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-gray-900">
                  Commandes d'installation rapide VPS (Ubuntu/Debian) :
                </span>
                <button
                  onClick={handleCopyBash}
                  className="flex items-center space-x-1.5 text-xs font-bold text-[#064E3B] hover:text-[#043d2e]"
                >
                  {copiedBash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBash ? 'Copié !' : 'Copier script'}</span>
                </button>
              </div>

              <pre className="bg-gray-900 text-emerald-400 p-4 rounded-2xl overflow-x-auto font-mono text-[11px] leading-relaxed">
                {bashScript}
              </pre>
            </div>
          </div>
        )}

        {/* Option 2: Local Reception PC */}
        {activeTab === 'local' && (
          <div className="space-y-6 text-xs text-gray-700">
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <h3 className="text-sm font-bold text-[#064E3B] flex items-center space-x-2 mb-2">
                <HardDrive className="w-4 h-4 text-[#F59E0B]" />
                <span>Déploiement Simple : Ordinateur Réception INNID</span>
              </h3>
              <p className="font-medium text-amber-950 leading-relaxed">
                Idéal pour un démarrage immédiat à l'accueil de l'espace de coworking INNID sans frais d'infrastructure récurrents. Tous les ordinateurs connectés au réseau Wi-Fi / Ethernet interne de l'établissement peuvent accéder à l'interface via l'adresse IP locale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h4 className="font-bold text-gray-900 text-sm">Installer Node.js</h4>
                <p className="text-gray-500">
                  Télécharger et installer Node.js v20+ LTS depuis le site officiel sur l'ordinateur de l'accueil.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h4 className="font-bold text-gray-900 text-sm">Lancer le serveur</h4>
                <p className="text-gray-500">
                  Ouvrir un terminal dans le dossier et exécuter : <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">npm run build && npx tsx backend/server.ts</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h4 className="font-bold text-gray-900 text-sm">Accéder sur le réseau</h4>
                <p className="text-gray-500">
                  Ouvrir le navigateur sur <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold">http://localhost:3000</code> ou l'IP locale pour les autres postes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Option 3: PostgreSQL Schema & Queries */}
        {activeTab === 'sql' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">
                Fichier : <code className="font-mono text-[#064E3B]">database/schema.sql</code> (PostgreSQL V1)
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center space-x-1.5 text-xs font-bold text-[#064E3B] hover:text-[#043d2e]"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copié !' : 'Copier SQL'}</span>
              </button>
            </div>

            <pre className="bg-gray-900 text-emerald-300 p-5 rounded-2xl overflow-x-auto font-mono text-[11px] leading-relaxed border border-gray-800">
              {SQL_SCHEMA}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
