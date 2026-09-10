import { Reservation, Salle } from '../types';

export const INNID_CONTACTS = {
  whatsappRaw: '213550123456',
  whatsappDisplay: '+213 550 12 34 56',
  instagramHandle: '@innidworkspace',
  instagramUrl: 'https://instagram.com/innidworkspace',
  email: 'inndweb@gmail.com',
  address: 'INNID Coworking & Salles de Réunion, Blida, Algérie',
};

export interface BookingMessageParams {
  clientNom?: string;
  clientTelephone?: string;
  salleNom?: string;
  date?: string;
  heureDebut?: string;
  heureFin?: string;
  nombrePersonnes?: number;
  formuleOuType?: string;
  chaises?: number[];
  notes?: string;
}

/**
 * Formats a clean, professional booking request text
 */
export function generateBookingMessageText(params: BookingMessageParams): string {
  const lines: string[] = [
    '✨ *Demande de Réservation - INNID Workspace Blida*',
    '----------------------------------------',
  ];

  if (params.clientNom) lines.push(`👤 *Nom / Client :* ${params.clientNom}`);
  if (params.clientTelephone) lines.push(`📞 *Téléphone :* ${params.clientTelephone}`);
  if (params.salleNom) lines.push(`🏢 *Espace / Salle :* ${params.salleNom}`);
  if (params.date) lines.push(`📅 *Date :* ${params.date}`);
  if (params.heureDebut && params.heureFin) lines.push(`⏰ *Créneau :* ${params.heureDebut} - ${params.heureFin}`);
  if (params.nombrePersonnes) lines.push(`👥 *Participants :* ${params.nombrePersonnes} personne(s)`);
  if (params.chaises && params.chaises.length > 0) lines.push(`🪑 *Chaises Coworking n° :* ${params.chaises.join(', ')}`);
  if (params.formuleOuType) lines.push(`🏷️ *Formule / Pack :* ${params.formuleOuType}`);
  if (params.notes) lines.push(`📝 *Besoins / Notes :* ${params.notes}`);

  lines.push('----------------------------------------');
  lines.push('Merci de me confirmer la disponibilité et les modalités.');

  return lines.join('\n');
}

/**
 * Formats confirmation / recap text for an existing reservation
 */
export function generateReservationRecapText(res: Reservation, salleNom?: string): string {
  const lines: string[] = [
    '📋 *RÉCAPITULATIF RÉSERVATION INNID WORKSPACE*',
    `Réf: #${res.id}`,
    '----------------------------------------',
    `👤 *Client :* ${res.client_nom}`,
    `📞 *Téléphone :* ${res.client_telephone}`,
    `🏢 *Salle :* ${salleNom || 'Salle ' + res.salle_id}`,
    `📅 *Date :* ${res.date}`,
    `⏰ *Horaires :* ${res.heure_debut} - ${res.heure_fin}`,
    `👥 *Nombre de personnes :* ${res.nombre_personnes}`,
  ];

  if (res.chaises_reservees && res.chaises_reservees.length > 0) {
    lines.push(`🪑 *Chaises n° :* ${res.chaises_reservees.join(', ')}`);
  }

  if (res.formule_tarifaire || res.type) {
    lines.push(`🏷️ *Pack / Type :* ${res.formule_tarifaire || res.type}`);
  }

  if (res.montant_total) {
    lines.push(`💰 *Montant :* ${res.montant_total.toLocaleString()} DA`);
  }

  lines.push(`📌 *Statut :* ${res.statut}`);

  if (res.notes) {
    lines.push(`📝 *Notes :* ${res.notes}`);
  }

  lines.push('----------------------------------------');
  lines.push('✉️ Contact INNID : inndweb@gmail.com | 💬 WhatsApp : +213 550 12 34 56 | 📸 Insta : @innidworkspace');

  return lines.join('\n');
}

/**
 * WhatsApp Direct URL
 */
export function getWhatsAppBookingUrl(params: BookingMessageParams): string {
  const text = generateBookingMessageText(params);
  return `https://wa.me/${INNID_CONTACTS.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * WhatsApp Share for Existing Reservation
 */
export function getWhatsAppRecapUrl(res: Reservation, salleNom?: string): string {
  const text = generateReservationRecapText(res, salleNom);
  // If sending to client phone directly if available (cleaning non-digits)
  const cleanPhone = res.client_telephone ? res.client_telephone.replace(/\D/g, '') : '';
  const targetPhone = cleanPhone.length >= 9 ? (cleanPhone.startsWith('0') ? '213' + cleanPhone.slice(1) : cleanPhone) : INNID_CONTACTS.whatsappRaw;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Email Direct URL (to inndweb@gmail.com)
 */
export function getEmailBookingUrl(params: BookingMessageParams): string {
  const subject = `Demande de réservation INNID - ${params.salleNom || 'Salle'} (${params.date || 'Date'})`;
  const body = generateBookingMessageText(params);
  return `mailto:${INNID_CONTACTS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Email Recap URL for Existing Reservation
 */
export function getEmailRecapUrl(res: Reservation, salleNom?: string): string {
  const subject = `Confirmation Réservation #${res.id} - INNID Workspace (${res.client_nom})`;
  const body = generateReservationRecapText(res, salleNom);
  return `mailto:${INNID_CONTACTS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
