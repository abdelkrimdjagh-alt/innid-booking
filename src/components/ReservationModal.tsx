import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  Check,
  Calendar,
  Clock,
  User,
  Phone,
  Building2,
  Users,
  FileText,
  ShieldAlert,
  ArrowRight,
  Calculator,
  Tag,
} from 'lucide-react';
import {
  Salle,
  Reservation,
  TypeReservation,
  StatutReservation,
  ConflitVerificationResult,
} from '../types';
import {
  verifierConflitReservation,
  ajouterOuModifierReservation,
  calculerMontantEstime,
  getChaisesStatus,
} from '../services/storage';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (res: Reservation) => void;
  salles: Salle[];
  selectedDate: string;
  initialReservation?: Reservation | null;
  prefillSalleId?: string;
  prefillHeure?: string;
  prefillChaises?: number[];
  prefillType?: TypeReservation;
  prefillNbPersonnes?: number;
}

const TYPES_RESERVATION: TypeReservation[] = [
  'Réunion',
  'Formation',
  'Coworking',
  'Pack Solo/Étudiant',
  'Pack Start-up',
  'Pack Pro',
  'Pass Journée',
  'Pass Heure',
  'Entreprise',
  'PME Clé en Main',
  'Studio Photo/Vidéo',
  'Domiciliation',
  'Autre',
];

const STATUTS_RESERVATION: StatutReservation[] = ['Confirmée', 'En attente', 'Annulée'];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  salles,
  selectedDate,
  initialReservation,
  prefillSalleId,
  prefillHeure,
  prefillChaises,
  prefillType,
  prefillNbPersonnes,
}) => {
  const activeSalles = salles.filter((s) => s.statut === 'Active');

  // Form states
  const [clientNom, setClientNom] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [salleId, setSalleId] = useState(activeSalles[0]?.id || '1');
  const [date, setDate] = useState(selectedDate);
  const [heureDebut, setHeureDebut] = useState('10:00');
  const [heureFin, setHeureFin] = useState('12:00');
  const [nombrePersonnes, setNombrePersonnes] = useState(6);
  const [type, setType] = useState<TypeReservation>('Réunion');
  const [statut, setStatut] = useState<StatutReservation>('Confirmée');
  const [notes, setNotes] = useState('');
  const [chaisesSelectionnees, setChaisesSelectionnees] = useState<number[]>([]);

  // Conflict state
  const [conflictResult, setConflictResult] = useState<ConflitVerificationResult>({ hasConflict: false });
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  // Initialize or reset form values
  useEffect(() => {
    if (initialReservation) {
      setClientNom(initialReservation.client_nom);
      setClientTelephone(initialReservation.client_telephone || '');
      setSalleId(initialReservation.salle_id);
      setDate(initialReservation.date);
      setHeureDebut(initialReservation.heure_debut);
      setHeureFin(initialReservation.heure_fin);
      setNombrePersonnes(initialReservation.nombre_personnes);
      setType(initialReservation.type);
      setStatut(initialReservation.statut);
      setNotes(initialReservation.notes || '');
      setChaisesSelectionnees(initialReservation.chaises_reservees || []);
    } else {
      setClientNom('');
      setClientTelephone('');
      setSalleId(prefillSalleId || activeSalles[0]?.id || '1');
      setDate(selectedDate);
      if (prefillHeure) {
        setHeureDebut(prefillHeure);
        const hNum = parseInt(prefillHeure.split(':')[0], 10) + 2;
        setHeureFin(`${hNum < 10 ? '0' : ''}${Math.min(20, hNum)}:00`);
      } else {
        setHeureDebut('10:00');
        setHeureFin('12:00');
      }
      setNombrePersonnes(prefillNbPersonnes || prefillChaises?.length || 1);
      setType(prefillType || 'Réunion');
      setStatut('Confirmée');
      setNotes('');
      setChaisesSelectionnees(prefillChaises || []);
    }
    setSubmittedAttempt(false);
  }, [
    initialReservation,
    prefillSalleId,
    prefillHeure,
    prefillChaises,
    prefillType,
    prefillNbPersonnes,
    selectedDate,
    isOpen,
  ]);

  const currentSalle = salles.find((s) => s.id === salleId);
  const isCoworking = currentSalle?.categorie === 'coworking' || currentSalle?.total_chaises === 45;

  // Real-time chairs status in coworking
  const chairsStatus = useMemo(() => {
    if (!isCoworking) return [];
    return getChaisesStatus(date, heureDebut, heureFin);
  }, [isCoworking, date, heureDebut, heureFin]);

  // Live anti-conflict checking
  useEffect(() => {
    if (!isOpen) return;

    if (statut === 'Annulée') {
      setConflictResult({ hasConflict: false });
      return;
    }

    const check = verifierConflitReservation(
      salleId,
      date,
      heureDebut,
      heureFin,
      initialReservation?.id,
      isCoworking && chaisesSelectionnees.length > 0 ? chaisesSelectionnees : undefined
    );
    setConflictResult(check);
  }, [salleId, date, heureDebut, heureFin, statut, initialReservation, chaisesSelectionnees, isCoworking, isOpen]);

  // Dynamic price calculation
  const estimationPrix = useMemo(() => {
    return calculerMontantEstime(currentSalle, heureDebut, heureFin, nombrePersonnes, type);
  }, [currentSalle, heureDebut, heureFin, nombrePersonnes, type]);

  if (!isOpen) return null;

  const exceedsCapacity = currentSalle ? nombrePersonnes > currentSalle.capacite : false;

  const handleToggleChair = (num: number) => {
    setChaisesSelectionnees((prev) => {
      let next: number[];
      if (prev.includes(num)) {
        next = prev.filter((n) => n !== num);
      } else {
        next = [...prev, num].sort((a, b) => a - b);
      }
      setNombrePersonnes(Math.max(1, next.length));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (!clientNom.trim() || !clientTelephone.trim()) {
      return;
    }

    if (conflictResult.hasConflict && statut !== 'Annulée') {
      return;
    }

    const result = ajouterOuModifierReservation({
      id: initialReservation?.id,
      client_nom: clientNom.trim(),
      client_telephone: clientTelephone.trim(),
      salle_id: salleId,
      date,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      nombre_personnes: Number(nombrePersonnes),
      chaises_reservees: isCoworking ? chaisesSelectionnees : undefined,
      type,
      statut,
      formule_tarifaire: estimationPrix.formule,
      montant_total: estimationPrix.montant,
      notes: notes.trim(),
    });

    if (result.success && result.reservation) {
      onSuccess(result.reservation);
      onClose();
    } else if (result.conflitResult) {
      setConflictResult(result.conflitResult);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header with INNID Forest Green */}
        <div className="bg-[#064E3B] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B] flex items-center justify-center text-white font-black text-lg">
              +
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {initialReservation ? 'Modifier la réservation' : 'Nouvelle réservation INNID'}
              </h2>
              <p className="text-xs text-emerald-200">
                Anti-chevauchement actif en temps réel • Tarifs officiels en Dinars Algériens (DA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Conflict Warning Box matching user specification */}
        {conflictResult.hasConflict && (
          <div className="bg-red-50 border-b-2 border-red-300 p-4 sm:p-5 flex items-start space-x-3 animate-in fade-in duration-200">
            <ShieldAlert className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h4 className="text-base font-black text-red-900 tracking-tight flex items-center space-x-1.5">
                <span>⚠️ CONFLIT DÉTECTÉ</span>
              </h4>
              <p className="text-sm text-red-800 whitespace-pre-line font-medium leading-snug">
                {conflictResult.message}
              </p>
              <p className="text-xs text-red-700 font-bold">
                ⛔ Impossible de contourner par l'interface. Veuillez modifier l'heure, la chaise ou choisir une autre salle.
              </p>

              {/* Suggestions / Alternatives */}
              {conflictResult.alternatives && conflictResult.alternatives.length > 0 && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <span className="text-xs font-bold text-red-900 block mb-1">
                    Salles alternatives disponibles sur ce créneau ({heureDebut} - {heureFin}) :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {conflictResult.alternatives.map((alt) => (
                      <button
                        key={alt.salleId}
                        type="button"
                        onClick={() => setSalleId(alt.salleId)}
                        className="bg-white border border-red-300 text-red-800 text-xs px-2.5 py-1 rounded-lg font-bold hover:bg-red-100 flex items-center space-x-1"
                      >
                        <span>{alt.salleNom}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs text-gray-700 max-h-[78vh] overflow-y-auto">
          {/* Section 1: Client & Contact */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider block">
              Coordonnées du client
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  NOM CLIENT *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="input-res-client-nom"
                    type="text"
                    required
                    value={clientNom}
                    onChange={(e) => setClientNom(e.target.value)}
                    placeholder="ex: Ahmed Benali, Sara Mansouri..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                  />
                </div>
                {submittedAttempt && !clientNom.trim() && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">
                    Le nom du client est obligatoire.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  TÉLÉPHONE *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="input-res-client-tel"
                    type="tel"
                    required
                    value={clientTelephone}
                    onChange={(e) => setClientTelephone(e.target.value)}
                    placeholder="ex: 06 52 14 38 90"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                  />
                </div>
                {submittedAttempt && !clientTelephone.trim() && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">
                    Le numéro de téléphone est obligatoire.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Salle / Espace & Formule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                ESPACE OU SALLE *
              </label>
              <select
                id="select-res-salle"
                value={salleId}
                onChange={(e) => {
                  setSalleId(e.target.value);
                  const s = salles.find((room) => room.id === e.target.value);
                  if (s && s.capacite < nombrePersonnes) {
                    setNombrePersonnes(s.capacite);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              >
                {activeSalles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.capacite} pers. max)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                TYPE / PACK SOUSCRIT
              </label>
              <select
                id="select-res-type"
                value={type}
                onChange={(e) => setType(e.target.value as TypeReservation)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              >
                {TYPES_RESERVATION.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coworking 45 Chairs Selector (if Coworking Space) */}
          {isCoworking && (
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-900 flex items-center space-x-1.5">
                  <span>🪑 Chaises Coworking réservées (sur 45)</span>
                </span>
                <span className="text-[11px] text-purple-700 font-bold">
                  {chaisesSelectionnees.length} chaise(s) choisie(s)
                </span>
              </div>
              <p className="text-[11px] text-purple-800">
                Cliquez sur les numéros de chaises souhaités. Vert = Libre, Rouge = Déjà occupée sur ce créneau.
              </p>

              <div className="grid grid-cols-9 sm:grid-cols-15 gap-1 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-purple-200">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((chairNum) => {
                  const chairMatch = chairsStatus.find((c) => c.numero === chairNum);
                  const isOccupied = chairMatch && chairMatch.statut !== 'Libre';
                  const isSelected = chaisesSelectionnees.includes(chairNum);

                  return (
                    <button
                      key={chairNum}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => handleToggleChair(chairNum)}
                      className={`h-7 text-[10px] font-black rounded-md flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isOccupied
                          ? 'bg-red-100 text-red-500 cursor-not-allowed line-through'
                          : 'bg-emerald-50 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                      }`}
                      title={isOccupied ? `Chaise #${chairNum} occupée` : `Chaise #${chairNum} libre`}
                    >
                      {chairNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Date, Horaires & Personnes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                DATE *
              </label>
              <input
                id="input-res-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                HEURE DÉBUT *
              </label>
              <input
                id="input-res-heure-debut"
                type="time"
                required
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                HEURE FIN *
              </label>
              <input
                id="input-res-heure-fin"
                type="time"
                required
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Nombre Personnes & Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                NOMBRE DE PERSONNES *
              </label>
              <input
                id="input-res-nb-personnes"
                type="number"
                min="1"
                max={currentSalle?.capacite || 50}
                required
                value={nombrePersonnes}
                onChange={(e) => setNombrePersonnes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              />
              {exceedsCapacity && (
                <span className="text-amber-600 text-[11px] font-bold mt-1 block">
                  ⚠️ Dépasse la capacité de la salle ({currentSalle?.capacite} max).
                </span>
              )}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                STATUT RÉSERVATION
              </label>
              <select
                id="select-res-statut"
                value={statut}
                onChange={(e) => setStatut(e.target.value as StatutReservation)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              >
                {STATUTS_RESERVATION.map((st) => (
                  <option key={st} value={st}>
                    {st === 'Confirmée' ? '🔴 Confirmée' : st === 'En attente' ? '🟠 En attente' : '⚪ Annulée'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Calculation Card */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                <Calculator className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>Tarif Calculé Automatiquement (DA)</span>
              </span>
              <p className="text-xs text-emerald-950 font-bold">
                {estimationPrix.formule}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-[#064E3B]">
                {estimationPrix.montant.toLocaleString()} DA
              </span>
              <span className="text-[10px] text-gray-500 block font-semibold">TTC</span>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              NOTES & REMARQUES
            </label>
            <textarea
              id="input-res-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Équipements spécifiques, service boissons café, aménagement..."
              className="w-full p-3 bg-white border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-[11px] text-gray-500">
              {conflictResult.hasConflict ? (
                <span className="text-red-600 font-black flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Enregistrement bloqué (conflit horaire)</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Créneau disponible et validé</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                id="btn-submit-reservation"
                type="submit"
                disabled={conflictResult.hasConflict && statut !== 'Annulée'}
                className={`px-6 py-2.5 rounded-xl font-black text-xs text-white shadow-md transition-all ${
                  conflictResult.hasConflict && statut !== 'Annulée'
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-[#064E3B] hover:bg-[#043d2e] active:scale-95'
                }`}
              >
                {initialReservation ? 'Mettre à jour' : 'ENREGISTRER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
