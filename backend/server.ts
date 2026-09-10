/**
 * INNID BOOKING - Serveur Backend Node.js + Express
 * 
 * Ce fichier peut être exécuté directement en production sur VPS ou machine locale:
 * `node server.ts` ou via Docker / PM2
 */

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Structure Salles INNID
interface SalleRecord {
  id: string;
  nom: string;
  capacite: number;
  total_chaises?: number;
  categorie?: string;
  description: string;
  statut: 'Active' | 'Indisponible';
  prix_heure?: number;
  prix_demi_journee?: number;
  prix_journee?: number;
}

// Structure Réservations INNID
interface ReservationRecord {
  id: string;
  client_nom: string;
  client_telephone: string;
  salle_id: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
  nombre_personnes: number;
  chaises_reservees?: number[];
  type: string;
  statut: string;
  formule_tarifaire?: string;
  montant_total?: number;
  notes?: string;
  created_at: string;
}

let salles: SalleRecord[] = [
  { id: '1', nom: 'Salle Réunion', capacite: 12, categorie: 'reunion', description: 'Salle de réunion avec vidéoprojecteur et fibre', statut: 'Active', prix_heure: 900, prix_demi_journee: 3500, prix_journee: 6000 },
  { id: '2', nom: 'Salle Cours', capacite: 15, categorie: 'cours', description: 'Salle adaptée aux formations et ateliers', statut: 'Active', prix_heure: 1200, prix_demi_journee: 2500, prix_journee: 4500 },
  { id: '3', nom: 'Salle Conférence', capacite: 30, categorie: 'conference', description: 'Grande salle équipée pour 30 pers', statut: 'Active', prix_demi_journee: 6000, prix_journee: 11000 },
  { id: '4', nom: 'Salle Visioconférence', capacite: 10, categorie: 'visio', description: 'Studio acoustique optimisé visio Logitech 4K', statut: 'Active', prix_heure: 1800, prix_demi_journee: 6500, prix_journee: 13500 },
  { id: '5', nom: 'Studio Photo / Vidéo', capacite: 6, categorie: 'studio', description: 'Espace création audiovisuelle', statut: 'Active', prix_heure: 3000, prix_demi_journee: 10000, prix_journee: 18000 },
  { id: '6', nom: 'Bureau Privé PME', capacite: 10, categorie: 'pme', description: 'Bureau fermé clé en main avec domiciliation', statut: 'Active', prix_heure: 2500, prix_demi_journee: 8000, prix_journee: 15000 },
  { id: '7', nom: 'Espace Coworking (45 chaises)', capacite: 45, total_chaises: 45, categorie: 'coworking', description: 'Espace de coworking collaboratif de 45 chaises', statut: 'Active', prix_heure: 300, prix_demi_journee: 600, prix_journee: 1000 },
];

let reservations: ReservationRecord[] = [
  {
    id: 'res-1',
    client_nom: 'Ahmed Benali',
    client_telephone: '06 52 14 38 90',
    salle_id: '3',
    date: '2026-09-08',
    heure_debut: '09:00',
    heure_fin: '10:30',
    nombre_personnes: 18,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: '1/2 Journée (6 000 DA)',
    montant_total: 6000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-2',
    client_nom: 'Sara Mansouri',
    client_telephone: '06 71 89 45 22',
    salle_id: '3',
    date: '2026-09-08',
    heure_debut: '10:30',
    heure_fin: '12:00',
    nombre_personnes: 22,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: '1/2 Journée (6 000 DA)',
    montant_total: 6000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-3',
    client_nom: 'Karim Ziani',
    client_telephone: '07 88 12 90 41',
    salle_id: '4',
    date: '2026-09-08',
    heure_debut: '11:00',
    heure_fin: '13:00',
    nombre_personnes: 6,
    type: 'Entreprise',
    statut: 'En attente',
    formule_tarifaire: 'Tarif Horaire (3 600 DA)',
    montant_total: 3600,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-5',
    client_nom: 'Amine Start-up Blida',
    client_telephone: '05 50 11 22 33',
    salle_id: '7',
    date: '2026-09-08',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 4,
    chaises_reservees: [1, 2, 3, 4],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up (30 000 DA)',
    montant_total: 30000,
    created_at: new Date().toISOString(),
  },
];

// Anti-overlap helper function (avec support des 45 chaises de coworking)
function checkReservationConflict(
  salle_id: string,
  date: string,
  heure_debut: string,
  heure_fin: string,
  excludeId?: string,
  chaisesDemandees?: number[]
) {
  const targetSalle = salles.find((s) => s.id === salle_id);
  const isCoworking = targetSalle?.categorie === 'coworking' || (targetSalle?.total_chaises || 0) > 0;

  if (isCoworking) {
    if (chaisesDemandees && chaisesDemandees.length > 0) {
      for (const ch of chaisesDemandees) {
        const match = reservations.find((r) => {
          if (r.statut === 'Annulée') return false;
          if (excludeId && r.id === excludeId) return false;
          if (r.salle_id !== salle_id) return false;
          if (r.date !== date) return false;
          const overlap = r.heure_debut < heure_fin && r.heure_fin > heure_debut;
          return overlap && r.chaises_reservees?.includes(ch);
        });
        if (match) {
          return {
            conflit: match,
            message: `⚠️ CHAISE COWORKING OCCUPÉE\nLa chaise n°${ch} est déjà occupée de ${match.heure_debut} à ${match.heure_fin} par ${match.client_nom}.`,
          };
        }
      }
    }
    return null;
  }

  // Salle entière
  const conflit = reservations.find((r) => {
    if (r.statut === 'Annulée') return false;
    if (excludeId && r.id === excludeId) return false;
    if (r.salle_id !== salle_id) return false;
    if (r.date !== date) return false;
    return r.heure_debut < heure_fin && r.heure_fin > heure_debut;
  });

  if (conflit) {
    return {
      conflit,
      message: `⚠️ SALLE DÉJÀ RÉSERVÉE\nCette salle est occupée de ${conflit.heure_debut} à ${conflit.heure_fin} par ${conflit.client_nom}.`,
    };
  }

  return null;
}

// Routes Salles
app.get('/api/salles', (_req: Request, res: Response) => {
  res.json({ success: true, data: salles });
});

app.post('/api/salles', (req: Request, res: Response) => {
  const { nom, capacite, description, statut, prix_heure, prix_demi_journee, prix_journee } = req.body;
  if (!nom || !capacite) {
    return res.status(400).json({ success: false, error: 'Nom et capacité requis' });
  }
  const newSalle: SalleRecord = {
    id: String(Date.now()),
    nom,
    capacite: Number(capacite),
    description: description || '',
    statut: statut || 'Active',
    prix_heure,
    prix_demi_journee,
    prix_journee,
  };
  salles.push(newSalle);
  res.status(201).json({ success: true, data: newSalle });
});

// Routes Réservations
app.get('/api/reservations', (req: Request, res: Response) => {
  const { date, salle_id, statut } = req.query;
  let filtered = [...reservations];
  if (date) filtered = filtered.filter((r) => r.date === String(date));
  if (salle_id) filtered = filtered.filter((r) => r.salle_id === String(salle_id));
  if (statut) filtered = filtered.filter((r) => r.statut === String(statut));
  res.json({ success: true, data: filtered });
});

// Vérification de conflit
app.post('/api/reservations/check-conflict', (req: Request, res: Response) => {
  const { salle_id, date, heure_debut, heure_fin, exclude_id, chaises } = req.body;
  const result = checkReservationConflict(salle_id, date, heure_debut, heure_fin, exclude_id, chaises);
  if (result) {
    return res.json({
      hasConflict: true,
      message: result.message,
      conflit: result.conflit,
    });
  }
  res.json({ hasConflict: false });
});

// Création avec contrôle strict anti-chevauchement
app.post('/api/reservations', (req: Request, res: Response) => {
  const {
    client_nom,
    client_telephone,
    salle_id,
    date,
    heure_debut,
    heure_fin,
    nombre_personnes,
    chaises_reservees,
    type,
    statut,
    formule_tarifaire,
    montant_total,
    notes,
  } = req.body;

  if (!client_nom || !salle_id || !date || !heure_debut || !heure_fin) {
    return res.status(400).json({ success: false, error: 'Champs obligatoires manquants.' });
  }

  const conflit = checkReservationConflict(salle_id, date, heure_debut, heure_fin, undefined, chaises_reservees);
  if (conflit) {
    return res.status(409).json({
      success: false,
      error: conflit.message,
      conflit: conflit.conflit,
    });
  }

  const newReservation: ReservationRecord = {
    id: 'res-' + Date.now(),
    client_nom,
    client_telephone: client_telephone || '',
    salle_id,
    date,
    heure_debut,
    heure_fin,
    nombre_personnes: Number(nombre_personnes) || 1,
    chaises_reservees,
    type: type || 'Réunion',
    statut: statut || 'Confirmée',
    formule_tarifaire,
    montant_total,
    notes,
    created_at: new Date().toISOString(),
  };

  reservations.unshift(newReservation);
  res.status(201).json({ success: true, data: newReservation });
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur INNID BOOKING démarré sur le port ${PORT}`);
  });
}

export default app;
