-- ==========================================================
-- INNID BOOKING - Schéma PostgreSQL & Données Initiales V1
-- ==========================================================

-- Création de l'extension UUID si souhaitée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des Clients
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    entreprise VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des Salles
CREATE TABLE IF NOT EXISTS salles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL DEFAULT 10,
    description TEXT,
    statut VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (statut IN ('Active', 'Indisponible')),
    equipements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des Réservations
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
    type VARCHAR(50) NOT NULL DEFAULT 'Réunion' CHECK (type IN ('Réunion', 'Formation', 'Coworking', 'Entreprise', 'Autre')),
    statut VARCHAR(30) NOT NULL DEFAULT 'Confirmée' CHECK (statut IN ('Confirmée', 'En attente', 'Annulée')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_horaires CHECK (heure_debut < heure_fin)
);

-- Index d'accélération pour la vérification anti-chevauchement
CREATE INDEX IF NOT EXISTS idx_reservations_conflit 
ON reservations (salle_id, date, heure_debut, heure_fin)
WHERE statut != 'Annulée';

-- ==========================================================
-- Données de départ pour INNID BOOKING (Exemples du prompt)
-- ==========================================================

INSERT INTO salles (id, nom, capacite, description, statut) VALUES
(1, 'Salle conférence', 30, 'Grande salle équipée pour présentations, assemblées et formations', 'Active'),
(2, 'Salle visioconférence', 10, 'Salle acoustique équipée caméra 4K et double écran tactile', 'Active'),
(3, 'Bureau privé', 7, 'Bureau feutré pour entretiens et réunions confidentielles', 'Active'),
(4, 'Espace coworking', 20, 'Espace de travail partagé avec wifi haut débit et prises dédiées', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Réinitialisation séquence salle
SELECT setval(pg_get_serial_sequence('salles', 'id'), coalesce(max(id), 1)) FROM salles;

-- Réservations initiales pour la journée du 08 Septembre 2026
INSERT INTO reservations (client_nom, client_telephone, salle_id, date, heure_debut, heure_fin, nombre_personnes, type, statut, notes) VALUES
('Ahmed Benali', '06 52 14 38 90', 1, '2026-09-08', '09:00', '10:30', 18, 'Réunion', 'Confirmée', 'Réunion trimestrielle équipe commerciale'),
('Sara Mansouri', '06 71 89 45 22', 1, '2026-09-08', '10:30', '12:00', 22, 'Formation', 'Confirmée', 'Formation interne logiciel'),
('Karim Ziani', '07 88 12 90 41', 2, '2026-09-08', '11:00', '13:00', 6, 'Entreprise', 'En attente', 'Appel d''offres international'),
('Ahmed Benali', '06 52 14 38 90', 1, '2026-09-08', '14:00', '16:00', 25, 'Entreprise', 'Confirmée', 'Présentation partenaires'),
('Karim Ziani', '07 88 12 90 41', 2, '2026-09-08', '14:00', '16:00', 8, 'Réunion', 'Confirmée', 'Débriefing opérationnel');
