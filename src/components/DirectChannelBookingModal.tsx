import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Instagram,
  Mail,
  Send,
  Copy,
  Check,
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  Tag,
  Users,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Salle, Reservation, TypeReservation } from '../types';
import {
  INNID_CONTACTS,
  BookingMessageParams,
  generateBookingMessageText,
  getWhatsAppBookingUrl,
  getEmailBookingUrl,
} from '../utils/contactChannels';

interface DirectChannelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salles: Salle[];
  selectedDate: string;
  onSaveToPlanning?: (res: Reservation) => void;
}

export const DirectChannelBookingModal: React.FC<DirectChannelBookingModalProps> = ({
  isOpen,
  onClose,
  salles,
  selectedDate,
  onSaveToPlanning,
}) => {
  if (!isOpen) return null;

  const activeSalles = salles.filter((s) => s.statut === 'Active');

  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'instagram' | 'email'>('whatsapp');
  const [salleId, setSalleId] = useState(activeSalles[0]?.id || '1');
  const [date, setDate] = useState(selectedDate);
  const [heureDebut, setHeureDebut] = useState('09:00');
  const [heureFin, setHeureFin] = useState('13:00');
  const [clientNom, setClientNom] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [nombrePersonnes, setNombrePersonnes] = useState(4);
  const [formuleOuType, setFormuleOuType] = useState<TypeReservation>('Réunion');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedSalle = salles.find((s) => s.id === salleId);

  const bookingParams: BookingMessageParams = {
    clientNom: clientNom.trim() || 'Client INNID',
    clientTelephone: clientTelephone.trim() || undefined,
    salleNom: selectedSalle?.nom || 'Salle INNID',
    date,
    heureDebut,
    heureFin,
    nombrePersonnes,
    formuleOuType,
    notes: notes.trim() || undefined,
  };

  const messageText = generateBookingMessageText(bookingParams);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppBookingUrl(bookingParams);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInstagram = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    // Open Instagram profile or DM
    window.open(INNID_CONTACTS.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenEmail = () => {
    const url = getEmailBookingUrl(bookingParams);
    window.location.href = url;
  };

  const handleSavePlanning = () => {
    if (!clientNom.trim()) {
      alert('Veuillez renseigner le nom du client avant d’enregistrer.');
      return;
    }

    if (onSaveToPlanning) {
      const newRes: Reservation = {
        id: `res-${Date.now()}`,
        client_nom: clientNom.trim(),
        client_telephone: clientTelephone.trim() || 'Non renseigné',
        salle_id: salleId,
        date,
        heure_debut: heureDebut,
        heure_fin: heureFin,
        nombre_personnes: nombrePersonnes,
        type: formuleOuType,
        statut: 'En attente',
        canal_reservation:
          activeChannel === 'whatsapp' ? 'WhatsApp' : activeChannel === 'instagram' ? 'Instagram' : 'Email',
        notes: notes ? `[Canal: ${activeChannel.toUpperCase()}] ${notes}` : `[Canal: ${activeChannel.toUpperCase()}]`,
        created_at: new Date().toISOString(),
      };
      onSaveToPlanning(newRes);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#064E3B] text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#F59E0B] text-[#064E3B] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Canaux Directs
              </span>
              <span className="text-xs text-emerald-200 font-medium">INNID Workspace Blida</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
              Réservation via WhatsApp, Insta ou Email
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Contactez-nous directement sur WhatsApp, Instagram ou par email à{' '}
              <strong className="text-[#F59E0B] font-mono">inndweb@gmail.com</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Channel Selector Tabs */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                activeChannel === 'whatsapp'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                {activeChannel === 'whatsapp' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 block">WhatsApp</span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold truncate">
                {INNID_CONTACTS.whatsappDisplay}
              </span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => setActiveChannel('instagram')}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                activeChannel === 'instagram'
                  ? 'border-pink-500 bg-pink-50/70 shadow-sm ring-2 ring-pink-500/20'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Instagram className="w-4 h-4" />
                </div>
                {activeChannel === 'instagram' && (
                  <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 block">Instagram</span>
              <span className="text-[11px] font-mono text-pink-700 font-semibold truncate">
                {INNID_CONTACTS.instagramHandle}
              </span>
            </button>

            {/* Email */}
            <button
              onClick={() => setActiveChannel('email')}
              className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                activeChannel === 'email'
                  ? 'border-[#064E3B] bg-emerald-50/70 shadow-sm ring-2 ring-[#064E3B]/20'
                  : 'border-gray-200 hover:border-[#064E3B]/40 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-4 h-4 text-[#F59E0B]" />
                </div>
                {activeChannel === 'email' && (
                  <span className="w-2 h-2 rounded-full bg-[#064E3B]"></span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 block">Email Officiel</span>
              <span className="text-[11px] font-mono text-[#064E3B] font-bold truncate">
                {INNID_CONTACTS.email}
              </span>
            </button>
          </div>

          {/* Quick Pre-fill Form */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Paramètres du créneau souhaité</span>
              </span>
              <span className="text-[11px] text-gray-500">Mise à jour dynamique du message</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Salle */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Espace / Salle</label>
                <select
                  value={salleId}
                  onChange={(e) => setSalleId(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-hidden"
                >
                  {activeSalles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom} ({s.capacite} pers)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-hidden"
                />
              </div>

              {/* Heures */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Début</label>
                  <input
                    type="time"
                    value={heureDebut}
                    onChange={(e) => setHeureDebut(e.target.value)}
                    className="w-full text-xs font-mono font-semibold bg-white border border-gray-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-[#064E3B] outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Fin</label>
                  <input
                    type="time"
                    value={heureFin}
                    onChange={(e) => setHeureFin(e.target.value)}
                    className="w-full text-xs font-mono font-semibold bg-white border border-gray-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-[#064E3B] outline-hidden"
                  />
                </div>
              </div>

              {/* Type / Formule */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Formule / Usage</label>
                <select
                  value={formuleOuType}
                  onChange={(e) => setFormuleOuType(e.target.value as TypeReservation)}
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent outline-hidden"
                >
                  <option value="Réunion">Réunion standard</option>
                  <option value="Coworking">Coworking (Poste individuel)</option>
                  <option value="Formation">Formation & Atelier</option>
                  <option value="Pack Solo/Étudiant">Pack Solo/Étudiant (Coworking)</option>
                  <option value="Pack Start-up">Pack Start-up</option>
                  <option value="Pack Pro">Pack Pro</option>
                  <option value="Pass Journée">Pass Journée (1 000 DA)</option>
                  <option value="Entreprise">Entreprise / PME</option>
                  <option value="Studio Photo/Vidéo">Studio Photo / Vidéo</option>
                  <option value="Domiciliation">Domiciliation Commerciale</option>
                </select>
              </div>

              {/* Nom du client */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Votre nom / Entreprise</label>
                <input
                  type="text"
                  value={clientNom}
                  onChange={(e) => setClientNom(e.target.value)}
                  placeholder="Ex: Sarah Benali / TechStart"
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B] outline-hidden"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={clientTelephone}
                  onChange={(e) => setClientTelephone(e.target.value)}
                  placeholder="Ex: 0550 12 34 56"
                  className="w-full text-xs font-mono font-semibold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B] outline-hidden"
                />
              </div>
            </div>

            {/* Notes optionnelles */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Notes ou besoins spécifiques</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Besoin du vidéoprojecteur, 10 personnes attendues, pause café"
                className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#064E3B] outline-hidden"
              />
            </div>
          </div>

          {/* Live Preview of Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">Aperçu du message formaté :</span>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-[#064E3B] hover:text-emerald-800 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
              </button>
            </div>

            <div className="bg-gray-900 text-gray-100 p-3.5 rounded-2xl font-mono text-xs whitespace-pre-line border border-gray-800 leading-relaxed select-all max-h-36 overflow-y-auto">
              {messageText}
            </div>
          </div>

          {/* Action Buttons for the Active Channel */}
          <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex items-center space-x-2">
              {activeChannel === 'whatsapp' && (
                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer sur WhatsApp (+213 550 12 34 56)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              )}

              {activeChannel === 'instagram' && (
                <button
                  onClick={handleOpenInstagram}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Ouvrir Instagram (@innidworkspace)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              )}

              {activeChannel === 'email' && (
                <button
                  onClick={handleOpenEmail}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Mail className="w-4 h-4 text-[#F59E0B]" />
                  <span>Écrire à inndweb@gmail.com</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              )}
            </div>

            {/* Option to also register to the planning */}
            {onSaveToPlanning && (
              <button
                onClick={handleSavePlanning}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                title="Enregistre la demande dans la base INNID en statut En attente"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Enregistré dans le planning !</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5 text-[#064E3B]" />
                    <span>Enregistrer dans le planning (En attente)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
