import React, { useState } from 'react';
import {
  X,
  Clock,
  Building2,
  Phone,
  User,
  Users,
  Calendar,
  FileText,
  Trash2,
  Edit,
  Ban,
  CheckCircle,
  Share2,
  MessageCircle,
  Instagram,
  Mail,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Reservation, Salle } from '../types';
import {
  INNID_CONTACTS,
  getWhatsAppRecapUrl,
  getEmailRecapUrl,
  generateReservationRecapText,
} from '../utils/contactChannels';

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  salles: Salle[];
  onClose: () => void;
  onEdit: (res: Reservation) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  reservation,
  salles,
  onClose,
  onEdit,
  onCancel,
  onDelete,
}) => {
  if (!reservation) return null;

  const [copied, setCopied] = useState(false);
  const salle = salles.find((s) => s.id === reservation.salle_id);

  const formatDateLong = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyRecap = () => {
    const text = generateReservationRecapText(reservation, salle?.nom);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppRecapUrl(reservation, salle?.nom);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInstagram = () => {
    const text = generateReservationRecapText(reservation, salle?.nom);
    navigator.clipboard.writeText(text);
    setCopied(true);
    window.open(INNID_CONTACTS.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenEmail = () => {
    const url = getEmailRecapUrl(reservation, salle?.nom);
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#064E3B] text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  reservation.statut === 'Confirmée'
                    ? 'bg-red-500 text-white'
                    : reservation.statut === 'En attente'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}
              >
                {reservation.statut}
              </span>
              <span className="text-xs text-emerald-200 font-mono">
                ID: {reservation.id}
              </span>
            </div>
            <h3 className="text-2xl font-black mt-1 tracking-tight">
              {reservation.client_nom}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5">
          {/* Room & Time High Contrast Box */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Salle réservée
              </span>
              <span className="text-xs font-semibold text-gray-600">
                Capacité max : {salle?.capacite} pers
              </span>
            </div>

            <div className="flex items-center space-x-2 text-lg font-black text-[#064E3B]">
              <Building2 className="w-5 h-5 text-[#F59E0B]" />
              <span>{salle?.nom || 'Salle'}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center space-x-1.5 text-gray-700">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span className="capitalize">{formatDateLong(reservation.date)}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#064E3B] font-mono font-bold">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span>{reservation.heure_debut} - {reservation.heure_fin}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <span className="text-gray-500 font-semibold block mb-1">Téléphone client</span>
              <a
                href={`tel:${reservation.client_telephone}`}
                className="font-mono font-bold text-[#064E3B] hover:underline flex items-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{reservation.client_telephone}</span>
              </a>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <span className="text-gray-500 font-semibold block mb-1">Participants & Chaises</span>
              <div className="font-bold text-gray-900 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span>{reservation.nombre_personnes} personnes</span>
              </div>
              {reservation.chaises_reservees && reservation.chaises_reservees.length > 0 && (
                <span className="text-[11px] text-purple-700 font-bold block mt-0.5">
                  Chaises : #{reservation.chaises_reservees.join(', #')}
                </span>
              )}
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <span className="text-gray-500 font-semibold block mb-1">Type d'événement / Pack</span>
              <span className="font-bold text-gray-900">{reservation.type}</span>
              {reservation.montant_total !== undefined && (
                <span className="text-[11px] text-[#064E3B] font-black block mt-0.5">
                  {reservation.montant_total.toLocaleString()} DA
                </span>
              )}
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <span className="text-gray-500 font-semibold block mb-1">Date d'enregistrement</span>
              <span className="font-mono text-gray-700">
                {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Notes */}
          {reservation.notes && (
            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 flex items-center space-x-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Notes & Instructions</span>
              </span>
              <p className="text-amber-950 italic">{reservation.notes}</p>
            </div>
          )}

          {/* Canal de réservation & Partage direct WhatsApp / Insta / inndweb@gmail.com */}
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#064E3B] tracking-wider flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Partager & Confirmer la réservation</span>
              </span>
              {reservation.canal_reservation && (
                <span className="bg-emerald-200/70 text-[#064E3B] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  Canal : {reservation.canal_reservation}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* WhatsApp */}
              <button
                onClick={handleOpenWhatsApp}
                className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-all"
                title="Envoyer le récapitulatif par WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </button>

              {/* Instagram */}
              <button
                onClick={handleOpenInstagram}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-all"
                title="Copier et ouvrir Instagram (@innidworkspace)"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </button>

              {/* Email inndweb@gmail.com */}
              <button
                onClick={handleOpenEmail}
                className="px-3 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-all"
                title="Envoyer un email à inndweb@gmail.com"
              >
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Email (inndweb)</span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-gray-600">
              <span>Contact INNID : <strong className="font-mono text-[#064E3B]">inndweb@gmail.com</strong></span>
              <button
                onClick={handleCopyRecap}
                className="font-bold text-[#064E3B] hover:underline flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copié !' : 'Copier texte'}</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onEdit(reservation);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>Modifier</span>
              </button>

              {reservation.statut !== 'Annulée' && (
                <button
                  onClick={() => {
                    onCancel(reservation.id);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Ban className="w-3.5 h-3.5 text-amber-700" />
                  <span>Annuler résa</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?')) {
                  onDelete(reservation.id);
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
