import {
  Salle,
  Reservation,
  ConflitVerificationResult,
  ChaiseStatus,
  PackCoworkingInfo,
  OffrePMEInfo,
} from '../types';

const STORAGE_KEYS = {
  SALLES: 'innid_salles_v2',
  RESERVATIONS: 'innid_reservations_v2',
  AUTH: 'innid_auth_v1',
};

// Official Catalog for INNID Blida
export const INITIAL_SALLES: Salle[] = [
  {
    id: '1',
    nom: 'Salle Réunion',
    capacite: 12,
    categorie: 'reunion',
    description: 'Salle de réunion moderne avec vidéoprojecteur, tableau blanc, clim et fibre.',
    statut: 'Active',
    prix_heure: 900,
    prix_demi_journee: 3500,
    prix_journee: 6000,
    equipements: ['Vidéoprojecteur HD', 'Tableau blanc magnétique', 'Climatisation', 'Wifi Fibre Haut Débit'],
    couleurBadge: 'border-emerald-600 bg-emerald-50 text-emerald-900',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '2',
    nom: 'Salle Cours',
    capacite: 15,
    categorie: 'cours',
    description: 'Salle adaptée aux formations, cours et ateliers collectifs avec disposition modulable.',
    statut: 'Active',
    prix_heure: 1200,
    prix_demi_journee: 2500,
    prix_journee: 4500,
    equipements: ['Tableau blanc', 'Climatisation', 'Wifi Fibre', 'Paperboard', 'Prises individuelles'],
    couleurBadge: 'border-blue-600 bg-blue-50 text-blue-900',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '3',
    nom: 'Salle Conférence',
    capacite: 30,
    categorie: 'conference',
    description: 'Espace de grande envergure pour conférences, séminaires et présentations clients (disponible en 1/2 journée et journée).',
    statut: 'Active',
    prix_heure: undefined, // Non disponible à l'heure
    prix_demi_journee: 6000,
    prix_journee: 11000,
    equipements: ['Écran 4K 85"', 'Système son surround', 'Microphones sans fil', 'Climatisation réversible', 'Wifi Fibre'],
    couleurBadge: 'border-indigo-600 bg-indigo-50 text-indigo-900',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '4',
    nom: 'Salle Visioconférence',
    capacite: 10,
    categorie: 'visio',
    description: 'Studio visioconférence acoustique haut de gamme pour réunions hybrides internationales.',
    statut: 'Active',
    prix_heure: 1800,
    prix_demi_journee: 6500,
    prix_journee: 13500,
    equipements: ['Caméra Logitech Rally 4K', 'Double écran tactile', 'Microphones de plafond', 'Insonorisation phonique'],
    couleurBadge: 'border-cyan-600 bg-cyan-50 text-cyan-900',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '5',
    nom: 'Studio Photo / Vidéo',
    capacite: 6,
    categorie: 'studio',
    description: 'Espace de création audiovisuelle tout équipé (éclairage studio, fonds, insonorisation).',
    statut: 'Active',
    prix_heure: 3000,
    prix_demi_journee: 10000,
    prix_journee: 18000,
    equipements: ['Kit Éclairage Softbox', 'Fonds Vert et Neutres', 'Trépieds pros', 'Climatisation', 'Fibre très haut débit'],
    couleurBadge: 'border-rose-600 bg-rose-50 text-rose-900',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '6',
    nom: 'Bureau Privé PME',
    capacite: 10,
    categorie: 'pme',
    description: 'Bureau privé fermé haut de gamme pour équipes PME (jusqu’à 10 personnes) avec domiciliation et conciergerie.',
    statut: 'Active',
    prix_heure: 2500,
    prix_demi_journee: 8000,
    prix_journee: 15000,
    equipements: ['Mobilier ergonomique', 'Accès sécurisé par badge', 'Ligne fibre dédiée', 'Service conciergerie'],
    couleurBadge: 'border-amber-600 bg-amber-50 text-amber-900',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '7',
    nom: 'Espace Coworking (45 chaises)',
    capacite: 45,
    total_chaises: 45,
    categorie: 'coworking',
    description: 'Grand espace de travail collaboratif de 45 chaises/postes. Packs Solo/Étudiant, Start-up, Pack Pro ou Pass Journée/Heure.',
    statut: 'Active',
    prix_heure: 300,
    prix_demi_journee: 600,
    prix_journee: 1000,
    equipements: ['45 chaises ergonomiques', 'Wifi 6 Fibre', 'Espace boissons café/thé', 'Prises 220V + USB individuelles', 'Casiers sécurisés'],
    couleurBadge: 'border-purple-600 bg-purple-50 text-purple-900',
    created_at: '2026-09-01T08:00:00Z',
  },
];

// Packs Coworking INNID Blida
export const PACKS_COWORKING: PackCoworkingInfo[] = [
  {
    id: 'solo-etudiant',
    nom: 'Pack Solo / Étudiant',
    publicCible: 'Étudiants & Freelances',
    connexion: 'Wifi Fibre',
    boissons: '12 boissons / mois',
    impressions: 'En option',
    accueilVisiteur: 'Non inclus',
    acces: '12 accès par mois (8h-20h)',
    prixBaseMensuel: 5850,
    groupe3a5: 5000,
    groupe6a10: 4500,
    groupePlus10: 'Tarif négociable',
  },
  {
    id: 'startup',
    nom: 'Pack Start-up',
    publicCible: 'Équipes & Porteurs de projets',
    connexion: 'Wifi Fibre',
    boissons: '16 boissons / mois',
    impressions: 'En option',
    accueilVisiteur: 'Oui inclus',
    acces: '16 accès par mois (8h-20h)',
    prixBaseMensuel: 8900,
    groupe3a5: 7500,
    groupe6a10: 7000,
    groupePlus10: 'Tarif négociable',
    populaire: true,
  },
  {
    id: 'pro',
    nom: 'Pack Pro',
    publicCible: 'Entrepreneurs & Professionnels',
    connexion: 'Wifi Fibre',
    boissons: '36 boissons / mois',
    impressions: '250 imp. / mois',
    accueilVisiteur: 'Oui inclus',
    acces: '24 accès par mois (8h-20h)',
    prixBaseMensuel: 18900,
    groupe3a5: 17000,
    groupe6a10: 16000,
    groupePlus10: 'Tarif négociable',
  },
  {
    id: 'pass-journee',
    nom: 'Pass Journée',
    publicCible: 'Accès ponctuel journée',
    connexion: 'Wifi Fibre',
    boissons: '1 café + 1 eau / jour',
    impressions: '10 imp. / jour',
    accueilVisiteur: 'Non inclus',
    acces: '1 journée complète (8h-20h)',
    prixBaseMensuel: 1000,
    groupe3a5: 900,
    groupe6a10: 800,
    groupePlus10: 'Tarif négociable',
  },
  {
    id: 'pass-heure',
    nom: 'Pass Heure',
    publicCible: 'Travail nomade rapide',
    connexion: 'Wifi Fibre',
    boissons: 'Fontaine eau',
    impressions: 'À l’unité',
    accueilVisiteur: 'Non inclus',
    acces: 'Facturation à l’heure',
    prixBaseMensuel: 300,
    groupe3a5: 300,
    groupe6a10: 250,
    groupePlus10: 'Tarif négociable',
  },
];

// Offres Entreprises & PME (Clé en main Blida)
export const OFFRES_PME: OffrePMEInfo[] = [
  {
    id: 'pme-essentiel',
    nom: 'PME ESSENTIEL',
    postes: '2 postes fixes dédiés',
    connexion: 'Accès internet fibre',
    boissons: '2 boissons / personne / jour',
    impressions: '200 impressions / mois',
    salleReunion: '2 accès / mois',
    domiciliation: 'Domiciliation commerciale',
    horaires: '8h - 20h (selon la demande)',
    support: 'Standard',
    prixMensuelHT: '50 000 DA',
  },
  {
    id: 'pme-business',
    nom: 'PME BUSINESS',
    postes: '7 postes fixes dédiés',
    connexion: 'Internet fibre dédié',
    boissons: '5 boissons / personne / jour',
    impressions: '500 impressions / mois',
    salleReunion: '4 accès / mois',
    domiciliation: 'Domiciliation commerciale',
    horaires: '8h00 - 20h00 (6j/7)',
    support: 'Support & conciergerie',
    prixMensuelHT: '85 000 DA',
  },
  {
    id: 'pme-premium',
    nom: 'PME PREMIUM',
    postes: 'Bureau privé fermé (jusqu’à 10 pers.)',
    connexion: 'Internet fibre dédié',
    boissons: 'Sur devis',
    impressions: 'Sur devis',
    salleReunion: 'Sur devis',
    domiciliation: 'Domiciliation + fiscal + assurance',
    horaires: '8h00 - 20h00 (6j/7)',
    support: 'Support dédié, secrétariat & signalétique',
    prixMensuelHT: 'Sur devis',
  },
];

// Offre Domiciliation Seule Blida
export const OFFRE_DOMICILIATION = {
  titre: 'DOMICILIATION SEULE',
  description: 'Idéal pour établir légalement et sereinement le siège social de votre entreprise à Blida.',
  tarifAdresse: '47 000 DA / 6 mois',
  detailsAdresse: 'Adresse commerciale & Boîte postale',
  fiscaliteAssurance: 'Sur devis (selon vos besoins précis)',
};

// Seed initial reservations
export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    client_nom: 'Ahmed Benali',
    client_telephone: '06 52 14 38 90',
    salle_id: '3', // Conférence
    date: '2026-09-08',
    heure_debut: '09:00',
    heure_fin: '10:30',
    nombre_personnes: 18,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: '1/2 Journée (6 000 DA)',
    montant_total: 6000,
    notes: 'Réunion trimestrielle équipe commerciale. Besoin de microphones.',
    created_at: '2026-09-07T14:20:00Z',
  },
  {
    id: 'res-2',
    client_nom: 'Sara Mansouri',
    client_telephone: '06 71 89 45 22',
    salle_id: '3', // Conférence
    date: '2026-09-08',
    heure_debut: '10:30',
    heure_fin: '12:00',
    nombre_personnes: 22,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: '1/2 Journée (6 000 DA)',
    montant_total: 6000,
    notes: 'Formation logicielle interne. Prévoir branchement HDMI principal.',
    created_at: '2026-09-06T11:15:00Z',
  },
  {
    id: 'res-3',
    client_nom: 'Karim Ziani',
    client_telephone: '07 88 12 90 41',
    salle_id: '4', // Visioconférence
    date: '2026-09-08',
    heure_debut: '11:00',
    heure_fin: '13:00',
    nombre_personnes: 6,
    type: 'Entreprise',
    statut: 'En attente',
    formule_tarifaire: 'À l’heure (2h x 1 800 DA = 3 600 DA)',
    montant_total: 3600,
    notes: 'Appel d’offres avec partenaires internationaux.',
    created_at: '2026-09-07T16:45:00Z',
  },
  {
    id: 'res-4',
    client_nom: 'Yasmine Larbi',
    client_telephone: '06 19 45 77 33',
    salle_id: '1', // Salle Réunion
    date: '2026-09-08',
    heure_debut: '09:00',
    heure_fin: '11:00',
    nombre_personnes: 8,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: 'À l’heure (2h x 900 DA = 1 800 DA)',
    montant_total: 1800,
    notes: 'Entretien de recrutement direction financière.',
    created_at: '2026-09-06T15:10:00Z',
  },
  {
    id: 'res-alert-1',
    client_nom: 'Me. Tarek Belhadj (Cabinet Juridique Mitidja)',
    client_telephone: '05 52 44 11 88',
    salle_id: '1', // Salle Réunion (débute à 11h45 - dans 15 min à 11h30)
    date: '2026-09-08',
    heure_debut: '11:45',
    heure_fin: '13:00',
    nombre_personnes: 6,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: 'À l’heure (1h15 - 1 500 DA)',
    montant_total: 1500,
    notes: 'Signature contrat investissement & audit. Préparer eau minérale et écran HDMI.',
    created_at: '2026-09-08T08:30:00Z',
  },
  {
    id: 'res-alert-2',
    client_nom: 'Inès Benmoussa (Agence E-Commerce Blida)',
    client_telephone: '06 60 11 99 22',
    salle_id: '5', // Studio Photo & Vidéo (débute à 12h00 - dans 30 min à 11h30)
    date: '2026-09-08',
    heure_debut: '12:00',
    heure_fin: '14:00',
    nombre_personnes: 4,
    type: 'Studio Photo/Vidéo',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Studio (2h x 2 500 DA = 5 000 DA)',
    montant_total: 5000,
    notes: 'Shooting photo produits catalogue automne. Remettre kit éclairage et carte d’accès studio.',
    created_at: '2026-09-08T09:00:00Z',
  },
  {
    id: 'res-5',
    client_nom: 'Amine Start-up Blida',
    client_telephone: '05 50 11 22 33',
    salle_id: '7', // Coworking
    date: '2026-09-08',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 4,
    chaises_reservees: [1, 2, 3, 4],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up Groupe 4 pers (7 500 DA/pers = 30 000 DA)',
    montant_total: 30000,
    notes: 'Équipe dev de la startup. Chaises 1 à 4 réservées.',
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'res-6',
    client_nom: 'Nadia Solo Étudiante',
    client_telephone: '06 65 44 33 22',
    salle_id: '7', // Coworking
    date: '2026-09-08',
    heure_debut: '10:00',
    heure_fin: '16:00',
    nombre_personnes: 1,
    chaises_reservees: [12],
    type: 'Pack Solo/Étudiant',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Solo / Étudiant (5 850 DA)',
    montant_total: 5850,
    notes: 'Préparation thèse de fin d’études. Chaise 12.',
    created_at: '2026-09-02T11:00:00Z',
  },
  {
    id: 'res-7',
    client_nom: 'Kamel Consultant',
    client_telephone: '07 70 88 99 00',
    salle_id: '7', // Coworking
    date: '2026-09-08',
    heure_debut: '08:30',
    heure_fin: '17:30',
    nombre_personnes: 1,
    chaises_reservees: [20],
    type: 'Pass Journée',
    statut: 'Confirmée',
    formule_tarifaire: 'Pass Journée Coworking (1 000 DA)',
    montant_total: 1000,
    notes: 'Pass journée avec 1 café et 1 eau inclus. Chaise 20.',
    created_at: '2026-09-08T08:00:00Z',
  },
  // Données mensuelles 2026 pour statistiques & Recharts
  {
    id: 'res-m1-1',
    client_nom: 'Société Al-Baraka',
    client_telephone: '05 41 22 33 44',
    salle_id: '3', // Conférence
    date: '2026-01-15',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 28,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée entière (11 000 DA)',
    montant_total: 11000,
    created_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'res-m1-2',
    client_nom: 'PME Tech Solutions',
    client_telephone: '05 55 11 88 99',
    salle_id: '6', // Bureau Privé PME
    date: '2026-01-20',
    heure_debut: '08:00',
    heure_fin: '19:00',
    nombre_personnes: 6,
    type: 'PME Business',
    statut: 'Confirmée',
    formule_tarifaire: 'PME Essentiel (50 000 DA)',
    montant_total: 50000,
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'res-m2-1',
    client_nom: 'Cabinet Conseil Ziani',
    client_telephone: '06 61 78 90 12',
    salle_id: '1', // Réunion
    date: '2026-02-10',
    heure_debut: '09:00',
    heure_fin: '17:00',
    nombre_personnes: 10,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée entière (6 000 DA)',
    montant_total: 6000,
    created_at: '2026-02-05T08:00:00Z',
  },
  {
    id: 'res-m2-2',
    client_nom: 'Agence Web Pixel',
    client_telephone: '05 60 99 88 77',
    salle_id: '7', // Coworking
    date: '2026-02-18',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 5,
    chaises_reservees: [5, 6, 7, 8, 9],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up Groupe (37 500 DA)',
    montant_total: 37500,
    created_at: '2026-02-01T09:00:00Z',
  },
  {
    id: 'res-m3-1',
    client_nom: 'Centre Formation Excellence',
    client_telephone: '07 71 22 44 66',
    salle_id: '2', // Salle Cours
    date: '2026-03-12',
    heure_debut: '08:30',
    heure_fin: '16:30',
    nombre_personnes: 14,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée entière (4 500 DA)',
    montant_total: 4500,
    created_at: '2026-03-01T09:00:00Z',
  },
  {
    id: 'res-m3-2',
    client_nom: 'SARL Agro-Industrie Mitidja',
    client_telephone: '05 50 44 33 22',
    salle_id: '6', // Bureau Privé PME
    date: '2026-03-22',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 8,
    type: 'PME Business',
    statut: 'Confirmée',
    formule_tarifaire: 'PME Business (85 000 DA)',
    montant_total: 85000,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'res-m4-1',
    client_nom: 'Studio Créa Média',
    client_telephone: '06 72 33 44 55',
    salle_id: '5', // Studio Photo/Vidéo
    date: '2026-04-08',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 5,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée entière Studio (18 000 DA)',
    montant_total: 18000,
    created_at: '2026-04-02T10:00:00Z',
  },
  {
    id: 'res-m4-2',
    client_nom: 'Groupe Étudiants USTHB / Blida',
    client_telephone: '05 51 88 44 22',
    salle_id: '7', // Coworking
    date: '2026-04-16',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 10,
    chaises_reservees: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    type: 'Pack Solo/Étudiant',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Étudiant Groupe 10 (45 000 DA)',
    montant_total: 45000,
    created_at: '2026-04-05T09:00:00Z',
  },
  {
    id: 'res-m5-1',
    client_nom: 'Conférence E-commerce Algérie',
    client_telephone: '06 63 11 22 33',
    salle_id: '3', // Conférence
    date: '2026-05-14',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 30,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée entière Conférence (11 000 DA)',
    montant_total: 11000,
    created_at: '2026-05-01T08:00:00Z',
  },
  {
    id: 'res-m5-2',
    client_nom: 'Société BTP Blida',
    client_telephone: '05 58 77 66 55',
    salle_id: '6', // Bureau PME
    date: '2026-05-20',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 7,
    type: 'PME Business',
    statut: 'Confirmée',
    formule_tarifaire: 'PME Business (85 000 DA)',
    montant_total: 85000,
    created_at: '2026-05-01T08:00:00Z',
  },
  {
    id: 'res-m6-1',
    client_nom: 'Incubateur Tech Innov',
    client_telephone: '05 40 88 77 66',
    salle_id: '7', // Coworking 45 chaises
    date: '2026-06-10',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 8,
    chaises_reservees: [30, 31, 32, 33, 34, 35, 36, 37],
    type: 'Pack Pro',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Pro Groupe 8 (128 000 DA)',
    montant_total: 128000,
    created_at: '2026-06-01T08:00:00Z',
  },
  {
    id: 'res-m6-2',
    client_nom: 'Webinaire International Visio',
    client_telephone: '06 60 44 88 11',
    salle_id: '4', // Visioconférence
    date: '2026-06-25',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 8,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Visioconférence (13 500 DA)',
    montant_total: 13500,
    created_at: '2026-06-15T09:00:00Z',
  },
  {
    id: 'res-m7-1',
    client_nom: 'Atelier Design UI/UX',
    client_telephone: '07 80 12 34 56',
    salle_id: '2', // Salle cours
    date: '2026-07-09',
    heure_debut: '09:00',
    heure_fin: '17:00',
    nombre_personnes: 12,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Salle Cours (4 500 DA)',
    montant_total: 4500,
    created_at: '2026-07-01T09:00:00Z',
  },
  {
    id: 'res-m7-2',
    client_nom: 'Holding Financière Alger',
    client_telephone: '05 52 99 11 00',
    salle_id: '6', // Bureau PME
    date: '2026-07-22',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 6,
    type: 'PME Essentiel',
    statut: 'Confirmée',
    formule_tarifaire: 'PME Essentiel (50 000 DA)',
    montant_total: 50000,
    created_at: '2026-07-01T08:00:00Z',
  },
  {
    id: 'res-m8-1',
    client_nom: 'Production Publicité Tournage',
    client_telephone: '06 61 22 55 88',
    salle_id: '5', // Studio photo/vidéo
    date: '2026-08-11',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 6,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée entière Studio (18 000 DA)',
    montant_total: 18000,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'res-m8-2',
    client_nom: 'Start-up FinTech Mitidja',
    client_telephone: '05 60 77 88 99',
    salle_id: '7', // Coworking 45 chaises
    date: '2026-08-20',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 6,
    chaises_reservees: [10, 11, 12, 13, 14, 15],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up Groupe 6 (42 000 DA)',
    montant_total: 42000,
    created_at: '2026-08-05T09:00:00Z',
  },
  {
    id: 'res-m9-1',
    client_nom: 'Masterclass IA & Data Blida',
    client_telephone: '05 50 11 33 55',
    salle_id: '3', // Conférence
    date: '2026-09-18',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 30,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Conférence (11 000 DA)',
    montant_total: 11000,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'res-m10-1',
    client_nom: 'Forum des Entrepreneurs Blida',
    client_telephone: '06 62 88 44 11',
    salle_id: '3', // Conférence
    date: '2026-10-12',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 30,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Conférence (11 000 DA)',
    montant_total: 11000,
    created_at: '2026-09-05T08:00:00Z',
  },
  {
    id: 'res-m10-2',
    client_nom: 'Entreprise Logistique Centre',
    client_telephone: '05 55 99 22 11',
    salle_id: '6', // Bureau PME
    date: '2026-10-25',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 8,
    type: 'PME Business',
    statut: 'Confirmée',
    formule_tarifaire: 'PME Business (85 000 DA)',
    montant_total: 85000,
    created_at: '2026-09-05T09:00:00Z',
  },
  // Données détaillées pour "Cette Semaine" (Semaine du 07 au 13 Septembre 2026) & Analyse Chaises
  {
    id: 'res-w-1',
    client_nom: 'Groupe Agro Mitidja',
    client_telephone: '05 50 11 99 88',
    salle_id: '3', // Conférence
    date: '2026-09-07',
    heure_debut: '09:00',
    heure_fin: '13:00',
    nombre_personnes: 16,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: '1/2 Journée (6 000 DA)',
    montant_total: 6000,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'res-w-2',
    client_nom: 'Start-up AI Algérie',
    client_telephone: '06 61 33 55 77',
    salle_id: '7', // Coworking
    date: '2026-09-07',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 4,
    chaises_reservees: [25, 26, 27, 28],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up (30 000 DA)',
    montant_total: 30000,
    notes: 'Chaises 25 à 28',
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'res-w-3',
    client_nom: 'Mehdi Freelance Dev',
    client_telephone: '07 70 12 34 56',
    salle_id: '7', // Coworking
    date: '2026-09-07',
    heure_debut: '08:30',
    heure_fin: '17:30',
    nombre_personnes: 1,
    chaises_reservees: [10],
    type: 'Pass Journée',
    statut: 'Confirmée',
    formule_tarifaire: 'Pass Journée (1 000 DA)',
    montant_total: 1000,
    created_at: '2026-09-07T08:00:00Z',
  },
  {
    id: 'res-w-4',
    client_nom: 'Cabinet Audit Conseil',
    client_telephone: '05 52 44 66 88',
    salle_id: '1', // Réunion
    date: '2026-09-09',
    heure_debut: '14:00',
    heure_fin: '17:00',
    nombre_personnes: 6,
    type: 'Réunion',
    statut: 'Confirmée',
    formule_tarifaire: '3h x 900 DA = 2 700 DA',
    montant_total: 2700,
    created_at: '2026-09-05T10:00:00Z',
  },
  {
    id: 'res-w-5',
    client_nom: 'Équipe Design Web',
    client_telephone: '06 63 88 11 22',
    salle_id: '7', // Coworking
    date: '2026-09-09',
    heure_debut: '08:30',
    heure_fin: '18:00',
    nombre_personnes: 3,
    chaises_reservees: [1, 2, 3],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up (22 500 DA)',
    montant_total: 22500,
    created_at: '2026-09-04T11:00:00Z',
  },
  {
    id: 'res-w-6',
    client_nom: 'Farid Architecte',
    client_telephone: '07 81 90 23 45',
    salle_id: '7', // Coworking
    date: '2026-09-09',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 1,
    chaises_reservees: [33],
    type: 'Pass Journée',
    statut: 'Confirmée',
    formule_tarifaire: 'Pass Journée (1 000 DA)',
    montant_total: 1000,
    created_at: '2026-09-09T08:30:00Z',
  },
  {
    id: 'res-w-7',
    client_nom: 'Formation Langues Pro',
    client_telephone: '05 55 12 78 90',
    salle_id: '2', // Salle Cours
    date: '2026-09-10',
    heure_debut: '09:00',
    heure_fin: '16:00',
    nombre_personnes: 12,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Cours (4 500 DA)',
    montant_total: 4500,
    created_at: '2026-09-03T09:00:00Z',
  },
  {
    id: 'res-w-8',
    client_nom: 'Trio Développeurs Mobile',
    client_telephone: '06 70 45 67 89',
    salle_id: '7', // Coworking
    date: '2026-09-10',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 3,
    chaises_reservees: [14, 15, 16],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up (22 500 DA)',
    montant_total: 22500,
    created_at: '2026-09-05T09:00:00Z',
  },
  {
    id: 'res-w-9',
    client_nom: 'Étudiants Médecine Blida',
    client_telephone: '05 40 22 11 33',
    salle_id: '7', // Coworking
    date: '2026-09-10',
    heure_debut: '10:00',
    heure_fin: '17:00',
    nombre_personnes: 2,
    chaises_reservees: [41, 42],
    type: 'Pass Journée',
    statut: 'Confirmée',
    formule_tarifaire: 'Pass Journée x2 (2 000 DA)',
    montant_total: 2000,
    created_at: '2026-09-10T09:30:00Z',
  },
  {
    id: 'res-w-10',
    client_nom: 'Visioconférence Export Maroc/Tunisie',
    client_telephone: '06 61 99 88 44',
    salle_id: '4', // Visioconférence
    date: '2026-09-11',
    heure_debut: '10:00',
    heure_fin: '13:00',
    nombre_personnes: 4,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: '3h x 1 800 DA = 5 400 DA',
    montant_total: 5400,
    created_at: '2026-09-06T14:00:00Z',
  },
  {
    id: 'res-w-11',
    client_nom: 'Duo Data Scientists',
    client_telephone: '07 72 34 56 78',
    salle_id: '7', // Coworking
    date: '2026-09-11',
    heure_debut: '09:00',
    heure_fin: '17:00',
    nombre_personnes: 2,
    chaises_reservees: [12, 13],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up (15 000 DA)',
    montant_total: 15000,
    created_at: '2026-09-08T10:00:00Z',
  },
  {
    id: 'res-w-12',
    client_nom: 'Séminaire Stratégie Retail',
    client_telephone: '05 50 77 88 99',
    salle_id: '3', // Conférence
    date: '2026-09-12',
    heure_debut: '10:00',
    heure_fin: '18:00',
    nombre_personnes: 25,
    type: 'Formation',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Conférence (11 000 DA)',
    montant_total: 11000,
    created_at: '2026-09-05T08:00:00Z',
  },
  {
    id: 'res-w-13',
    client_nom: 'Hackathon Weekend INNID',
    client_telephone: '06 62 11 33 55',
    salle_id: '7', // Coworking
    date: '2026-09-12',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 6,
    chaises_reservees: [1, 2, 3, 4, 5, 6],
    type: 'Pack Pro',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Pro Groupe 6 (96 000 DA)',
    montant_total: 96000,
    created_at: '2026-09-06T10:00:00Z',
  },
  {
    id: 'res-w-14',
    client_nom: 'Riad Consultant Finance',
    client_telephone: '07 80 44 22 11',
    salle_id: '7', // Coworking
    date: '2026-09-12',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 1,
    chaises_reservees: [20],
    type: 'Pass Journée',
    statut: 'Confirmée',
    formule_tarifaire: 'Pass Journée (1 000 DA)',
    montant_total: 1000,
    created_at: '2026-09-12T08:00:00Z',
  },
  {
    id: 'res-w-15',
    client_nom: 'Shooting E-commerce Mode',
    client_telephone: '05 51 33 77 99',
    salle_id: '5', // Studio Photo/Vidéo
    date: '2026-09-13',
    heure_debut: '13:00',
    heure_fin: '18:00',
    nombre_personnes: 4,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Demi-journée Studio (10 000 DA)',
    montant_total: 10000,
    created_at: '2026-09-08T15:00:00Z',
  },
  {
    id: 'res-w-16',
    client_nom: 'Étudiants Révisions Concours',
    client_telephone: '06 60 12 34 89',
    salle_id: '7', // Coworking
    date: '2026-09-13',
    heure_debut: '10:00',
    heure_fin: '18:00',
    nombre_personnes: 2,
    chaises_reservees: [38, 39],
    type: 'Pass Journée',
    statut: 'Confirmée',
    formule_tarifaire: 'Pass Journée x2 (2 000 DA)',
    montant_total: 2000,
    created_at: '2026-09-13T09:00:00Z',
  },
  // T4 (Novembre & Décembre 2026)
  {
    id: 'res-m11-1',
    client_nom: 'Conférence Fin d’Année PME',
    client_telephone: '05 40 55 66 77',
    salle_id: '3', // Conférence
    date: '2026-11-15',
    heure_debut: '09:00',
    heure_fin: '19:00',
    nombre_personnes: 30,
    type: 'Entreprise',
    statut: 'Confirmée',
    formule_tarifaire: 'Journée Conférence (11 000 DA)',
    montant_total: 11000,
    created_at: '2026-09-05T08:00:00Z',
  },
  {
    id: 'res-m11-2',
    client_nom: 'Équipe Logiciel SaaS',
    client_telephone: '06 71 22 33 44',
    salle_id: '7', // Coworking
    date: '2026-11-20',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 4,
    chaises_reservees: [1, 2, 3, 4],
    type: 'Pack Start-up',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Start-up (30 000 DA)',
    montant_total: 30000,
    created_at: '2026-09-05T09:00:00Z',
  },
  {
    id: 'res-m12-1',
    client_nom: 'Entreprise Conseil International',
    client_telephone: '05 55 44 33 22',
    salle_id: '6', // Bureau PME
    date: '2026-12-10',
    heure_debut: '08:00',
    heure_fin: '20:00',
    nombre_personnes: 8,
    type: 'PME Business',
    statut: 'Confirmée',
    formule_tarifaire: 'PME Business (85 000 DA)',
    montant_total: 85000,
    created_at: '2026-09-05T09:00:00Z',
  },
  {
    id: 'res-m12-2',
    client_nom: 'Groupe Étudiants Projets Finaux',
    client_telephone: '06 63 99 88 11',
    salle_id: '7', // Coworking
    date: '2026-12-18',
    heure_debut: '09:00',
    heure_fin: '18:00',
    nombre_personnes: 6,
    chaises_reservees: [15, 16, 17, 18, 19, 20],
    type: 'Pack Solo/Étudiant',
    statut: 'Confirmée',
    formule_tarifaire: 'Pack Étudiant Groupe 6 (27 000 DA)',
    montant_total: 27000,
    created_at: '2026-09-05T10:00:00Z',
  },
];

export function getSalles(): Salle[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALLES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= 6) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  saveSalles(INITIAL_SALLES);
  return INITIAL_SALLES;
}

export function saveSalles(salles: Salle[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SALLES, JSON.stringify(salles));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function getReservations(): Reservation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map((r: Reservation) => r.id));
        const missing = INITIAL_RESERVATIONS.filter((r) => !existingIds.has(r.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          saveReservations(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  saveReservations(INITIAL_RESERVATIONS);
  return INITIAL_RESERVATIONS;
}

export function saveReservations(reservations: Reservation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

/**
 * RÈGLE ANTI-CONFLIT SERVEUR / CŒUR DE SÉCURITÉ INNID:
 * Gère à la fois les salles à usage exclusif (Réunion, Cours, Conférence, Visio, Studio, Bureau PME)
 * ET l'Espace Coworking (45 chaises indépendantes ou en groupe).
 */
export function verifierConflitReservation(
  salle_id: string,
  date: string,
  heure_debut: string,
  heure_fin: string,
  excludeReservationId?: string,
  chaisesDemandees?: number[]
): ConflitVerificationResult {
  const reservations = getReservations();
  const salles = getSalles();
  const targetSalle = salles.find((s) => s.id === salle_id);

  if (targetSalle && targetSalle.statut === 'Indisponible') {
    return {
      hasConflict: true,
      message: `⚠️ ESPACE INDISPONIBLE : "${targetSalle.nom}" est actuellement désactivé pour maintenance.`,
      salleNom: targetSalle.nom,
    };
  }

  if (heure_debut >= heure_fin) {
    return {
      hasConflict: true,
      message: `⚠️ HORAIRE INVALIDE : L'heure de début (${heure_debut}) doit être strictement antérieure à l'heure de fin (${heure_fin}).`,
      salleNom: targetSalle?.nom,
    };
  }

  // 1. Spécificité Espace Coworking (45 chaises)
  const isCoworking = targetSalle?.categorie === 'coworking' || (targetSalle?.total_chaises || 0) > 0;
  if (isCoworking) {
    // Si des numéros précis de chaises sont demandés, vérifie si une des chaises est déjà occupée
    if (chaisesDemandees && chaisesDemandees.length > 0) {
      for (const chairNum of chaisesDemandees) {
        const conflitChaise = reservations.find((r) => {
          if (r.statut === 'Annulée') return false;
          if (excludeReservationId && r.id === excludeReservationId) return false;
          if (r.salle_id !== salle_id) return false;
          if (r.date !== date) return false;
          const overlap = r.heure_debut < heure_fin && r.heure_fin > heure_debut;
          if (!overlap) return false;

          return r.chaises_reservees?.includes(chairNum);
        });

        if (conflitChaise) {
          return {
            hasConflict: true,
            chaisesEnConflit: [chairNum],
            conflitAvec: conflitChaise,
            message: `⚠️ CHAISE COWORKING OCCUPÉE\nLa chaise n°${chairNum} est déjà occupée de ${conflitChaise.heure_debut} à ${conflitChaise.heure_fin} par ${conflitChaise.client_nom}.`,
            salleNom: targetSalle?.nom,
          };
        }
      }
    }

    // Vérifier la capacité globale restante (sur les 45 chaises)
    const activeCoworkingOverlaps = reservations.filter((r) => {
      if (r.statut === 'Annulée') return false;
      if (excludeReservationId && r.id === excludeReservationId) return false;
      if (r.salle_id !== salle_id) return false;
      if (r.date !== date) return false;
      return r.heure_debut < heure_fin && r.heure_fin > heure_debut;
    });

    const chaisesOccupeesCount = activeCoworkingOverlaps.reduce((acc, r) => {
      return acc + (r.chaises_reservees?.length || r.nombre_personnes || 1);
    }, 0);

    const demandeCount = chaisesDemandees?.length || 1;
    const capaciteMax = targetSalle?.total_chaises || 45;

    if (chaisesOccupeesCount + demandeCount > capaciteMax) {
      return {
        hasConflict: true,
        message: `⚠️ CAPACITÉ COWORKING DÉPASSÉE\nIl reste seulement ${Math.max(0, capaciteMax - chaisesOccupeesCount)} chaises libres sur 45 pour ce créneau (${demandeCount} demandée(s)).`,
        salleNom: targetSalle?.nom,
      };
    }

    return { hasConflict: false };
  }

  // 2. Salles entières exclusives (Réunion, Cours, Conférence, Visio, Studio, PME)
  const conflit = reservations.find((r) => {
    if (r.statut === 'Annulée') return false;
    if (excludeReservationId && r.id === excludeReservationId) return false;
    if (r.salle_id !== salle_id) return false;
    if (r.date !== date) return false;

    // Overlap condition: startA < endB and endA > startB
    return r.heure_debut < heure_fin && r.heure_fin > heure_debut;
  });

  if (conflit) {
    const alternatives = salles
      .filter((s) => s.id !== salle_id && s.statut === 'Active')
      .filter((s) => {
        const hasOtherConflit = reservations.some(
          (r) =>
            r.salle_id === s.id &&
            r.date === date &&
            r.statut !== 'Annulée' &&
            r.heure_debut < heure_fin &&
            r.heure_fin > heure_debut
        );
        return !hasOtherConflit;
      })
      .map((s) => ({
        salleId: s.id,
        salleNom: s.nom,
        creneauLibre: `${date} de ${heure_debut} à ${heure_fin}`,
      }));

    return {
      hasConflict: true,
      conflitAvec: conflit,
      message: `⚠️ SALLE DÉJÀ RÉSERVÉE\nCette salle est occupée de ${conflit.heure_debut} à ${conflit.heure_fin} par ${conflit.client_nom}.`,
      salleNom: targetSalle?.nom,
      alternatives,
    };
  }

  return { hasConflict: false };
}

/**
 * Calcule l'état en temps réel des 45 chaises de l'espace coworking
 * pour une date et une tranche horaire données.
 */
export function getChaisesStatus(date: string, heureDebut: string, heureFin: string): ChaiseStatus[] {
  const reservations = getReservations();
  const coworkingRoom = getSalles().find((s) => s.total_chaises === 45 || s.categorie === 'coworking');
  const coworkingId = coworkingRoom?.id || '7';

  const overlappingReservations = reservations.filter((r) => {
    if (r.statut === 'Annulée') return false;
    if (r.salle_id !== coworkingId) return false;
    if (r.date !== date) return false;
    return r.heure_debut < heureFin && r.heure_fin > heureDebut;
  });

  const chairs: ChaiseStatus[] = [];
  for (let i = 1; i <= 45; i++) {
    const match = overlappingReservations.find((r) => r.chaises_reservees?.includes(i));
    if (match) {
      chairs.push({
        numero: i,
        statut: match.statut === 'Confirmée' ? 'Occupée' : 'En attente',
        reservation: match,
      });
    } else {
      chairs.push({
        numero: i,
        statut: 'Libre',
      });
    }
  }

  return chairs;
}

/**
 * Calculateur automatique de tarif en Dinars Algériens (DA)
 */
export function calculerMontantEstime(
  salle: Salle | undefined,
  heureDebut: string,
  heureFin: string,
  nbPersonnes: number,
  typeReservation: string
): { formule: string; montant: number } {
  if (!salle) return { formule: 'Non calculé', montant: 0 };

  // Calcul durée en heures
  const [h1, m1] = heureDebut.split(':').map(Number);
  const [h2, m2] = heureFin.split(':').map(Number);
  const dureeHeures = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);

  // 1. Packs Coworking
  if (typeReservation === 'Pack Solo/Étudiant') {
    let prixParPers = 5850;
    if (nbPersonnes >= 6) prixParPers = 4500;
    else if (nbPersonnes >= 3) prixParPers = 5000;
    const total = prixParPers * nbPersonnes;
    return {
      formule: `Pack Solo / Étudiant (${nbPersonnes} pers. x ${prixParPers.toLocaleString()} DA)`,
      montant: total,
    };
  }

  if (typeReservation === 'Pack Start-up') {
    let prixParPers = 8900;
    if (nbPersonnes >= 6) prixParPers = 7000;
    else if (nbPersonnes >= 3) prixParPers = 7500;
    const total = prixParPers * nbPersonnes;
    return {
      formule: `Pack Start-up (${nbPersonnes} pers. x ${prixParPers.toLocaleString()} DA)`,
      montant: total,
    };
  }

  if (typeReservation === 'Pack Pro') {
    let prixParPers = 18900;
    if (nbPersonnes >= 6) prixParPers = 16000;
    else if (nbPersonnes >= 3) prixParPers = 17000;
    const total = prixParPers * nbPersonnes;
    return {
      formule: `Pack Pro (${nbPersonnes} pers. x ${prixParPers.toLocaleString()} DA)`,
      montant: total,
    };
  }

  if (typeReservation === 'Pass Journée') {
    let prixJour = 1000;
    if (nbPersonnes >= 6) prixJour = 800;
    else if (nbPersonnes >= 3) prixJour = 900;
    const total = prixJour * nbPersonnes;
    return {
      formule: `Pass Journée (${nbPersonnes} pers. x ${prixJour.toLocaleString()} DA)`,
      montant: total,
    };
  }

  if (typeReservation === 'Pass Heure') {
    const total = Math.ceil(dureeHeures) * 300 * nbPersonnes;
    return {
      formule: `Pass Heure (${Math.ceil(dureeHeures)}h x 300 DA x ${nbPersonnes} pers.)`,
      montant: total,
    };
  }

  if (typeReservation === 'PME Clé en Main') {
    if (nbPersonnes <= 2) {
      return { formule: 'PME Essentiel (2 postes fixes)', montant: 50000 };
    } else if (nbPersonnes <= 7) {
      return { formule: 'PME Business (7 postes fixes)', montant: 85000 };
    }
    return { formule: 'PME Premium (Bureau fermé jusqu’à 10 pers.)', montant: 120000 };
  }

  // 2. Salles à la carte selon la durée
  if (dureeHeures >= 7 && salle.prix_journee) {
    return {
      formule: `Tarif Journée (9h-20h) : ${salle.prix_journee.toLocaleString()} DA`,
      montant: salle.prix_journee,
    };
  }

  if (dureeHeures >= 3.5 && salle.prix_demi_journee) {
    return {
      formule: `Tarif 1/2 Journée (4h) : ${salle.prix_demi_journee.toLocaleString()} DA`,
      montant: salle.prix_demi_journee,
    };
  }

  if (salle.prix_heure) {
    const total = Math.ceil(dureeHeures) * salle.prix_heure;
    return {
      formule: `Tarif Horaire (${Math.ceil(dureeHeures)}h x ${salle.prix_heure.toLocaleString()} DA)`,
      montant: total,
    };
  }

  if (salle.prix_demi_journee) {
    return {
      formule: `Tarif 1/2 Journée : ${salle.prix_demi_journee.toLocaleString()} DA`,
      montant: salle.prix_demi_journee,
    };
  }

  return { formule: 'Tarif standard', montant: 0 };
}

export function ajouterOuModifierReservation(reservationData: Partial<Reservation>): {
  success: boolean;
  reservation?: Reservation;
  error?: string;
  conflitResult?: ConflitVerificationResult;
} {
  const reservations = getReservations();

  if (
    !reservationData.client_nom ||
    !reservationData.salle_id ||
    !reservationData.date ||
    !reservationData.heure_debut ||
    !reservationData.heure_fin
  ) {
    return { success: false, error: 'Champs obligatoires manquants.' };
  }

  // Anti-conflict check
  const conflit = verifierConflitReservation(
    reservationData.salle_id,
    reservationData.date,
    reservationData.heure_debut,
    reservationData.heure_fin,
    reservationData.id,
    reservationData.chaises_reservees
  );

  if (conflit.hasConflict) {
    return {
      success: false,
      error: conflit.message,
      conflitResult: conflit,
    };
  }

  let finalReservation: Reservation;

  if (reservationData.id) {
    const index = reservations.findIndex((r) => r.id === reservationData.id);
    if (index === -1) {
      return { success: false, error: 'Réservation introuvable.' };
    }

    finalReservation = {
      ...reservations[index],
      ...reservationData,
      updated_at: new Date().toISOString(),
    } as Reservation;

    reservations[index] = finalReservation;
  } else {
    finalReservation = {
      id: 'res-' + Date.now(),
      client_nom: reservationData.client_nom,
      client_telephone: reservationData.client_telephone || '',
      salle_id: reservationData.salle_id,
      date: reservationData.date,
      heure_debut: reservationData.heure_debut,
      heure_fin: reservationData.heure_fin,
      nombre_personnes: Number(reservationData.nombre_personnes) || 1,
      chaises_reservees: reservationData.chaises_reservees || [],
      type: reservationData.type || 'Réunion',
      statut: reservationData.statut || 'Confirmée',
      formule_tarifaire: reservationData.formule_tarifaire,
      montant_total: reservationData.montant_total,
      notes: reservationData.notes || '',
      created_at: new Date().toISOString(),
    };

    reservations.unshift(finalReservation);
  }

  saveReservations(reservations);
  return { success: true, reservation: finalReservation };
}

export function annulerReservation(id: string): boolean {
  const reservations = getReservations();
  const index = reservations.findIndex((r) => r.id === id);
  if (index !== -1) {
    reservations[index].statut = 'Annulée';
    reservations[index].updated_at = new Date().toISOString();
    saveReservations(reservations);
    return true;
  }
  return false;
}

export function supprimerReservation(id: string): boolean {
  const reservations = getReservations();
  const filtered = reservations.filter((r) => r.id !== id);
  if (filtered.length !== reservations.length) {
    saveReservations(filtered);
    return true;
  }
  return false;
}

export function enregistrerSalle(salleData: Partial<Salle>): Salle {
  const salles = getSalles();
  let savedSalle: Salle;

  if (salleData.id) {
    const index = salles.findIndex((s) => s.id === salleData.id);
    if (index !== -1) {
      savedSalle = { ...salles[index], ...salleData } as Salle;
      salles[index] = savedSalle;
    } else {
      savedSalle = {
        ...salleData,
        id: salleData.id,
        created_at: new Date().toISOString(),
      } as Salle;
      salles.push(savedSalle);
    }
  } else {
    savedSalle = {
      id: String(Date.now()),
      nom: salleData.nom || 'Nouvelle salle',
      capacite: Number(salleData.capacite) || 10,
      description: salleData.description || '',
      statut: salleData.statut || 'Active',
      equipements: salleData.equipements || ['Wifi Fibre', 'Climatisation'],
      created_at: new Date().toISOString(),
    };
    salles.push(savedSalle);
  }

  saveSalles(salles);
  return savedSalle;
}

export function toggleStatutSalle(salleId: string): Salle | undefined {
  const salles = getSalles();
  const target = salles.find((s) => s.id === salleId);
  if (target) {
    target.statut = target.statut === 'Active' ? 'Indisponible' : 'Active';
    saveSalles(salles);
    return target;
  }
  return undefined;
}

export function supprimerSalle(salleId: string): boolean {
  const salles = getSalles();
  const filtered = salles.filter((s) => s.id !== salleId);
  if (filtered.length !== salles.length) {
    saveSalles(filtered);
    return true;
  }
  return false;
}

export function resetDonneesExemple(): void {
  saveSalles(INITIAL_SALLES);
  saveReservations(INITIAL_RESERVATIONS);
}
