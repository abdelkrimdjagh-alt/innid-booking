export interface Salle {
  id: string;
  nom: string;
  capacite: number;
  description: string;
  statut: 'Active' | 'Indisponible';
  categorie?: 'coworking' | 'reunion' | 'cours' | 'conference' | 'visio' | 'studio' | 'pme';
  equipements?: string[];
  couleurBadge?: string;
  prix_heure?: number; // DA
  prix_demi_journee?: number; // DA (4h)
  prix_journee?: number; // DA (9h-20h)
  total_chaises?: number; // Pour l'espace coworking (ex: 45 chaises)
  created_at: string;
}

export interface Client {
  id: string;
  nom: string;
  telephone: string;
  email?: string;
  entreprise?: string;
  created_at: string;
}

export type StatutReservation = 'Confirmée' | 'En attente' | 'Annulée';
export type TypeReservation =
  | 'Réunion'
  | 'Formation'
  | 'Coworking'
  | 'Entreprise'
  | 'Pack Solo/Étudiant'
  | 'Pack Start-up'
  | 'Pack Pro'
  | 'Pass Journée'
  | 'Pass Heure'
  | 'PME Clé en Main'
  | 'PME Essentiel'
  | 'PME Business'
  | 'PME Premium'
  | 'Domiciliation'
  | 'Studio Photo/Vidéo'
  | 'Autre';

export interface Reservation {
  id: string;
  client_id?: string;
  client_nom: string;
  client_telephone: string;
  salle_id: string;
  date: string; // YYYY-MM-DD
  heure_debut: string; // HH:MM
  heure_fin: string; // HH:MM
  nombre_personnes: number;
  type: TypeReservation;
  statut: StatutReservation;
  chaises_reservees?: number[]; // Liste des numéros de chaises (1 à 45 pour Coworking)
  formule_tarifaire?: string; // ex: 'Pack Étudiant (5 850 DA)', 'Journée (6 000 DA)'
  montant_total?: number; // en Dinars Algériens (DA)
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ConflitVerificationResult {
  hasConflict: boolean;
  conflitAvec?: Reservation;
  message?: string;
  salleNom?: string;
  chaisesEnConflit?: number[];
  alternatives?: {
    salleId: string;
    salleNom: string;
    creneauLibre: string;
  }[];
}

export interface ChaiseStatus {
  numero: number;
  statut: 'Libre' | 'Occupée' | 'En attente';
  reservation?: Reservation;
}

export interface PackCoworkingInfo {
  id: string;
  nom: string;
  publicCible: string;
  connexion: string;
  boissons: string;
  impressions: string;
  accueilVisiteur: string;
  acces: string;
  prixBaseMensuel: number; // DA
  groupe3a5: number; // DA / pers
  groupe6a10: number; // DA / pers
  groupePlus10: string;
  populaire?: boolean;
}

export interface OffrePMEInfo {
  id: string;
  nom: string;
  postes: string;
  connexion: string;
  boissons: string;
  impressions: string;
  salleReunion: string;
  domiciliation: string;
  horaires: string;
  support: string;
  prixMensuelHT: string;
}

export interface FilterOptions {
  searchQuery: string;
  salleId: string;
  date: string;
  statut: string;
  type: string;
}

export interface UserSession {
  role: 'admin' | 'reception';
  name: string;
  email: string;
  isAuthenticated: boolean;
}
