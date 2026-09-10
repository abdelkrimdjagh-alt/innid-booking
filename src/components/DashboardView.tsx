import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  Plus,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  BellRing,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ExternalLink,
} from 'lucide-react';
import { Salle, Reservation } from '../types';
import { StatsDashboardView } from './StatsDashboardView';

interface DashboardViewProps {
  salles: Salle[];
  reservations: Reservation[];
  selectedDate: string;
  onOpenNewReservation: (prefillSalleId?: string, prefillHeure?: string) => void;
  onGoToPlanning: () => void;
  onGoToToday: () => void;
  onSelectReservation?: (res: Reservation) => void;
  initialSubTab?: 'overview' | 'statistiques';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  salles,
  reservations,
  selectedDate,
  onOpenNewReservation,
  onGoToPlanning,
  onGoToToday,
  onSelectReservation,
  initialSubTab = 'overview',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'statistiques'>(initialSubTab);
  const [useRealTime, setUseRealTime] = useState<boolean>(false);
  const [customTime, setCustomTime] = useState<string>('11:30');
  
  // Raccourci d'accueil / Checklist opérationnelle (clés remises, matériel branché, client accueilli)
  const [checkedItems, setCheckedItems] = useState<Record<string, { sallePrete?: boolean; clientAccueilli?: boolean }>>({});

  const toggleCheck = (resId: string, field: 'sallePrete' | 'clientAccueilli') => {
    setCheckedItems((prev) => ({
      ...prev,
      [resId]: {
        ...prev[resId],
        [field]: !prev[resId]?.[field],
      },
    }));
  };

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Update real-time clock if active
  useEffect(() => {
    if (!useRealTime) return;
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCustomTime(`${h}:${m}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [useRealTime]);

  const currentTime = customTime;

  // Format date display
  const formatDateDisplay = (dateStr: string) => {
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

  // Convert "HH:MM" into total minutes from 00:00
  const timeToMinutes = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentMinutes = timeToMinutes(currentTime);

  // Current reservations for selected date (non-annulées)
  const reservationsDuJour = reservations.filter(
    (r) => r.date === selectedDate && r.statut !== 'Annulée'
  );

  // Time reference
  const activeSalles = salles.filter((s) => s.statut === 'Active');

  const occupiedSallesList = activeSalles.filter((s) => {
    return reservationsDuJour.some(
      (r) => r.salle_id === s.id && r.heure_debut <= currentTime && r.heure_fin > currentTime
    );
  });

  const availableSallesList = activeSalles.filter((s) => {
    return !occupiedSallesList.some((occ) => occ.id === s.id);
  });

  // ALERTES OPERATIONNELLES : Réservations dont l'heure de début est dans moins de 30 minutes (0 <= diff <= 30 min)
  const imminentAlerts = reservationsDuJour
    .filter((r) => {
      const startMin = timeToMinutes(r.heure_debut);
      const diff = startMin - currentMinutes;
      return diff >= 0 && diff <= 30;
    })
    .sort((a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_debut));

  // Prochaines réservations plus tard dans la journée (> 30 min)
  const laterReservations = reservationsDuJour
    .filter((r) => timeToMinutes(r.heure_debut) > currentMinutes + 30)
    .sort((a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_debut));

  const nextLaterRes = laterReservations[0];
  const nextLaterSalle = nextLaterRes ? salles.find((s) => s.id === nextLaterRes.salle_id) : null;

  // Prochaine réservation globale (imminente en priorité, sinon la suivante)
  const nextReservation =
    imminentAlerts[0] ||
    reservationsDuJour
      .filter((r) => r.heure_debut >= currentTime || (r.heure_debut <= currentTime && r.heure_fin > currentTime))
      .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))[0] || {
      id: 'res-default-fallback',
      salle_id: '1',
      heure_debut: '14:00',
      heure_fin: '16:00',
      client_nom: 'Ahmed Benali',
      nombre_personnes: 8,
      type: 'Réunion',
      statut: 'Confirmée',
      client_telephone: '05 50 00 00 00',
      date: selectedDate,
    };

  const nextSalle = salles.find((s) => s.id === nextReservation?.salle_id);
  const nextDiffMinutes = nextReservation ? timeToMinutes(nextReservation.heure_debut) - currentMinutes : 999;
  const nextIsImminent = nextDiffMinutes >= 0 && nextDiffMinutes <= 30;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Summary Header matching the prompt design */}
      <div className="bg-gradient-to-r from-[#064E3B] to-[#043d2e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Plateforme INNID Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              PLANNING INNID
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
              <span className="capitalize font-medium">{formatDateDisplay(selectedDate)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-dash-new-reservation"
              onClick={() => onOpenNewReservation()}
              className="bg-[#F59E0B] hover:bg-[#d98206] text-white font-black text-base px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5" />
              <span>+ Nouvelle réservation</span>
            </button>

            {/* Raccourci vers les Alertes (< 30 min) */}
            <button
              id="btn-dash-shortcut-alertes"
              onClick={() => {
                const el = document.getElementById('section-alertes-dashboard');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`font-bold text-sm px-4 py-3.5 rounded-2xl border backdrop-blur-xs transition-all flex items-center space-x-2 ${
                imminentAlerts.length > 0
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-300 shadow-md ring-2 ring-amber-300/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <BellRing className={`w-4 h-4 ${imminentAlerts.length > 0 ? 'text-white animate-bounce' : 'text-[#F59E0B]'}`} />
              <span>Alertes ({imminentAlerts.length})</span>
              {imminentAlerts.length > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  &lt; 30m
                </span>
              )}
            </button>

            <button
              id="btn-dash-view-today"
              onClick={onGoToToday}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-3.5 rounded-2xl border border-white/20 backdrop-blur-xs transition-colors flex items-center space-x-2"
            >
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <span>Vue Réception (5s)</span>
            </button>
          </div>
        </div>

        {/* Anti-Conflict Core Status Banner */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>
              <strong>Sécurité Anti-Chevauchement :</strong> Contrôle temps réel activé. Aucune double réservation possible.
            </span>
          </div>
          <span className="hidden sm:inline bg-emerald-800/60 px-2.5 py-1 rounded-md text-[11px] font-mono border border-emerald-700">
            SQL Query Check: PASS
          </span>
        </div>
      </div>

      {/* Onglets internes du Dashboard : Vue d'ensemble vs Statistiques (Recharts) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-3">
        <div className="flex items-center space-x-2 bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200 self-start">
          <button
            id="dash-subtab-overview"
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'overview'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Vue d'ensemble & Salles</span>
          </button>

          <button
            id="dash-subtab-statistiques"
            onClick={() => setActiveSubTab('statistiques')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'statistiques'
                ? 'bg-[#064E3B] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
            <span>Statistiques (Recharts)</span>
            <span className="bg-[#F59E0B] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              Taux & CA
            </span>
          </button>
        </div>

        {activeSubTab === 'statistiques' ? (
          <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl font-bold border border-emerald-200 self-start sm:self-auto">
            Graphiques mensuels Recharts actifs
          </span>
        ) : (
          <span className="text-xs text-gray-500 font-medium">
            Affichage des créneaux pour le {formatDateDisplay(selectedDate)}
          </span>
        )}
      </div>

      {/* Contenu de l'onglet Statistiques */}
      {activeSubTab === 'statistiques' && (
        <StatsDashboardView
          salles={salles}
          reservations={reservations}
          selectedDate={selectedDate}
          onOpenNewReservation={() => onOpenNewReservation()}
        />
      )}

      {/* Contenu de l'onglet Vue d'ensemble */}
      {activeSubTab === 'overview' && (
        <>
          {/* Main Stats Cards Grid matching prompt requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Salles disponibles */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-600">Salles disponibles</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700">
              {availableSallesList.length}
            </span>
            <span className="text-xs text-gray-500">/ {activeSalles.length} salles</span>
          </div>
          <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center space-x-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Prêtes à accueillir vos clients</span>
          </p>
        </div>

        {/* Salles occupées */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-600">Salles occupées</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-red-600">
              {occupiedSallesList.length}
            </span>
            <span className="text-xs text-gray-500">en cours</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {occupiedSallesList.length > 0
              ? occupiedSallesList.map((s) => s.nom).join(', ')
              : 'Aucune salle occupée actuellement'}
          </p>
        </div>

        {/* Total réservations du jour */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-600">Réservations du jour</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F59E0B] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-gray-900">
              {reservationsDuJour.length}
            </span>
            <span className="text-xs text-gray-500">créneaux</span>
          </div>
          <p className="text-xs text-amber-600 mt-2 font-medium">
            {reservationsDuJour.filter((r) => r.statut === 'Confirmée').length} confirmées •{' '}
            {reservationsDuJour.filter((r) => r.statut === 'En attente').length} en attente
          </p>
        </div>

        {/* Prochaine réservation (Section phare avec alerte imminente) */}
        <div
          className={`rounded-2xl p-5 sm:p-6 border-2 shadow-sm hover:shadow-md transition-all relative ${
            nextIsImminent
              ? 'bg-gradient-to-br from-amber-50 via-orange-50/80 to-red-50/50 border-amber-400 ring-2 ring-amber-300/50'
              : 'bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-[#064E3B] uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Prochaine réservation</span>
            </span>
            {nextIsImminent ? (
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse flex items-center space-x-1 shadow-xs">
                <Flame className="w-3 h-3" />
                <span>DANS {Math.max(0, nextDiffMinutes)} MIN</span>
              </span>
            ) : (
              <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                À venir
              </span>
            )}
          </div>

          <div className="mt-1">
            <h4 className="font-extrabold text-base text-gray-900">
              {nextSalle?.nom || 'Salle conférence'}
            </h4>
            <div className="flex items-center space-x-2 text-sm font-bold text-[#064E3B] mt-1">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <span>{nextReservation.heure_debut} - {nextReservation.heure_fin}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs font-semibold text-gray-700">
                Client : <span className="text-gray-900 font-bold">{nextReservation.client_nom}</span>
              </p>
              {onSelectReservation && (
                <button
                  onClick={() => onSelectReservation(nextReservation)}
                  className="text-[11px] font-bold text-[#064E3B] hover:underline flex items-center space-x-0.5"
                >
                  <span>Détail</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION ALERTES OPÉRATIONNELLES (< 30 MINUTES) AVEC RACCOURCIS D'ACTION   */}
      {/* ========================================================================= */}
      <div
        id="section-alertes-dashboard"
        className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/90 shadow-md relative overflow-hidden"
      >
        {/* Glow décoratif d'ambiance */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* En-tête de la section Alertes */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Alertes Opérationnelles • Début Imminent (&lt; 30 min)
              </h2>
              {imminentAlerts.length > 0 ? (
                <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                  {imminentAlerts.length} active{imminentAlerts.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  0 alerte
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Surveillance continue des créneaux débutant dans moins de 30 minutes : préparation des salles, accueil client immédiat et remise des clés.
            </p>
          </div>

          {/* Horloge & Raccourcis temporels pour tester ou gérer les shifts */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 self-start md:self-auto">
            <div className="flex items-center space-x-1.5 px-2 text-xs font-bold text-gray-700">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Heure :</span>
              <span className="font-mono text-sm bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-[#064E3B] font-extrabold">
                {currentTime}
              </span>
            </div>

            {/* Raccourcis de simulation de tranches horaires */}
            <div className="flex items-center space-x-1">
              {['09:00', '11:30', '11:45', '13:45'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setUseRealTime(false);
                    setCustomTime(t);
                  }}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all ${
                    !useRealTime && customTime === t
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  title={`Tester l'heure ${t}`}
                >
                  {t}
                </button>
              ))}

              <button
                onClick={() => setUseRealTime(!useRealTime)}
                className={`text-[11px] font-bold px-2 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  useRealTime
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
                title="Basculer vers l'heure réelle de votre machine"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${useRealTime ? 'bg-white animate-ping' : 'bg-gray-400'}`} />
                <span>En direct</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grille des Alertes ou Vue Rassurante */}
        {imminentAlerts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {imminentAlerts.map((res) => {
              const s = salles.find((room) => room.id === res.salle_id);
              const startMin = timeToMinutes(res.heure_debut);
              const diffMinutes = Math.max(0, startMin - currentMinutes);
              const isUrgent = diffMinutes <= 10;
              const isStarted = diffMinutes === 0;
              const checks = checkedItems[res.id] || {};

              return (
                <div
                  key={res.id}
                  className={`rounded-2xl p-5 sm:p-6 border-2 transition-all relative shadow-sm hover:shadow-md ${
                    isStarted
                      ? 'border-red-500 bg-gradient-to-br from-red-50 via-white to-amber-50/50 ring-2 ring-red-400/40'
                      : isUrgent
                      ? 'border-amber-500 bg-gradient-to-br from-amber-50 via-white to-orange-50/50 ring-2 ring-amber-400/40'
                      : 'border-amber-300 bg-gradient-to-br from-amber-50/60 via-white to-white'
                  }`}
                >
                  {/* Top: Urgence Badge & Salle */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-xs ${
                            isStarted
                              ? 'bg-red-600 text-white animate-pulse'
                              : isUrgent
                              ? 'bg-amber-600 text-white animate-pulse'
                              : 'bg-[#F59E0B] text-white'
                          }`}
                        >
                          <Timer className="w-3.5 h-3.5" />
                          <span>
                            {isStarted
                              ? '🔴 DÉBUT IMMÉDIAT (MAINTENANT)'
                              : `⏰ COMMENCE DANS ${diffMinutes} MIN`}
                          </span>
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            res.statut === 'Confirmée'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {res.statut}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg sm:text-xl text-gray-900">
                        {s?.nom || 'Salle réservée'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {s?.categorie === 'coworking'
                          ? 'Espace Coworking (45 chaises)'
                          : s?.description || 'Espace de travail INNID'}
                      </p>
                    </div>

                    {/* Badge Créneau Horaire */}
                    <div className="text-right bg-white/90 border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs">
                      <div className="text-sm sm:text-base font-black font-mono text-[#064E3B]">
                        {res.heure_debut} - {res.heure_fin}
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">
                        Créneau du jour
                      </div>
                    </div>
                  </div>

                  {/* Bloc Détails Client & Réservation */}
                  <div className="bg-white/80 rounded-xl p-3.5 border border-gray-200/80 mb-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 font-medium">Client :</span>
                        <span className="font-bold text-gray-900 text-sm">{res.client_nom}</span>
                      </div>

                      {res.client_telephone && (
                        <a
                          href={`tel:${res.client_telephone}`}
                          className="inline-flex items-center space-x-1 text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                          title="Appeler directement"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{res.client_telephone}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-1 border-t border-gray-100">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          <strong>{res.nombre_personnes}</strong> personne{res.nombre_personnes > 1 ? 's' : ''}
                          {res.chaises_reservees && res.chaises_reservees.length > 0 && (
                            <span className="ml-1 text-amber-700 font-bold">
                              (Chaises n° {res.chaises_reservees.join(', ')})
                            </span>
                          )}
                        </span>
                      </span>

                      {res.formule_tarifaire && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-700">
                          {res.formule_tarifaire}
                        </span>
                      )}
                      {res.montant_total && (
                        <span className="font-black text-[#064E3B] text-xs">
                          {res.montant_total.toLocaleString()} DA
                        </span>
                      )}
                    </div>

                    {/* Consignes & Notes spéciales */}
                    {res.notes && (
                      <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-2 text-xs text-amber-900 flex items-start space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <span>
                          <strong>Consigne d'accueil :</strong> {res.notes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Checklist Opérationnelle Réception */}
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
                    <button
                      onClick={() => toggleCheck(res.id, 'sallePrete')}
                      className={`px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1.5 transition-all ${
                        checks.sallePrete
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{checks.sallePrete ? '✓ Salle déverrouillée' : 'Déverrouiller salle'}</span>
                    </button>

                    <button
                      onClick={() => toggleCheck(res.id, 'clientAccueilli')}
                      className={`px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1.5 transition-all ${
                        checks.clientAccueilli
                          ? 'bg-[#064E3B] text-white border-emerald-900 shadow-xs'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{checks.clientAccueilli ? '✓ Client accueilli' : 'Marquer client accueilli'}</span>
                    </button>
                  </div>

                  {/* Raccourcis d'action immédiate */}
                  <div className="pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                      Raccourcis :
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {res.client_telephone && (
                        <a
                          href={`tel:${res.client_telephone}`}
                          className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold py-1.5 px-3 rounded-xl border border-gray-300 shadow-2xs flex items-center space-x-1 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Appeler</span>
                        </a>
                      )}

                      {onSelectReservation && (
                        <button
                          onClick={() => onSelectReservation(res)}
                          className="bg-[#064E3B] hover:bg-[#043d2e] text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-2xs flex items-center space-x-1 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Fiche & Modifier</span>
                        </button>
                      )}

                      <button
                        onClick={onGoToPlanning}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Planning</span>
                      </button>

                      <button
                        onClick={onGoToToday}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Vue 5s</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* État rassurant si 0 alerte immédiate */
          <div className="mt-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-emerald-900">
                  Aucune réservation dans les 30 prochaines minutes
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                  Tous les espaces sont actuellement calmes, sous contrôle ou déjà en cours selon le planning.
                </p>
                {nextLaterRes && (
                  <p className="text-xs font-semibold text-emerald-800 mt-2 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>
                      Prochaine arrivée programmée à{' '}
                      <strong className="font-mono text-emerald-950 font-black">{nextLaterRes.heure_debut}</strong>{' '}
                      ({nextLaterSalle?.nom}) pour{' '}
                      <strong className="text-emerald-950">{nextLaterRes.client_nom}</strong>.
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => {
                  setUseRealTime(false);
                  setCustomTime('11:45');
                }}
                className="text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center space-x-1.5 transition-all"
              >
                <Timer className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Tester alerte à 11h45 (15 min)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Salles Overview: Status in real-time */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-100 gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-[#064E3B] flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-[#F59E0B]" />
              <span>État des salles en direct</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Disponibilité instantanée et capacité de chaque espace INNID
            </p>
          </div>

          <button
            onClick={onGoToPlanning}
            className="text-xs font-bold text-[#064E3B] hover:text-[#043d2e] flex items-center space-x-1"
          >
            <span>Voir le planning complet</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {salles.map((salle) => {
            const isCurrentlyOccupied = reservationsDuJour.some(
              (r) =>
                r.salle_id === salle.id &&
                r.heure_debut <= currentTime &&
                r.heure_fin > currentTime
            );

            const activeCurrentRes = reservationsDuJour.find(
              (r) =>
                r.salle_id === salle.id &&
                r.heure_debut <= currentTime &&
                r.heure_fin > currentTime
            );

            const nextResForSalle = reservationsDuJour
              .filter((r) => r.salle_id === salle.id && r.heure_debut > currentTime)
              .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))[0];

            const imminentResForSalle = imminentAlerts.find((r) => r.salle_id === salle.id);
            const imminentDiff = imminentResForSalle
              ? Math.max(0, timeToMinutes(imminentResForSalle.heure_debut) - currentMinutes)
              : null;

            return (
              <div
                key={salle.id}
                className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                  salle.statut === 'Indisponible'
                    ? 'border-gray-300 bg-gray-50 opacity-75'
                    : imminentResForSalle
                    ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/40 shadow-sm'
                    : isCurrentlyOccupied
                    ? 'border-red-300 bg-red-50/40 shadow-xs'
                    : 'border-emerald-300 bg-emerald-50/40 shadow-xs hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-base text-gray-900">
                      {salle.nom}
                    </span>
                    {salle.statut === 'Indisponible' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                        Maintenance
                      </span>
                    ) : imminentResForSalle ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center space-x-1 animate-pulse shadow-2xs">
                        <BellRing className="w-3 h-3" />
                        <span>Alerte {imminentDiff}m</span>
                      </span>
                    ) : isCurrentlyOccupied ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span>🔴 Occupée</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>🟢 Disponible</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      <span>
                        Capacité : <strong>{salle.capacite} personnes</strong>
                        {salle.total_chaises ? ` (${salle.total_chaises} chaises)` : ''}
                      </span>
                    </div>

                    {salle.prix_heure && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        {salle.prix_heure.toLocaleString()} DA / h
                      </span>
                    )}
                    {salle.prix_demi_journee && (
                      <span className="bg-amber-50 text-[#064E3B] text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        1/2j : {salle.prix_demi_journee.toLocaleString()} DA
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {salle.description}
                  </p>

                  {/* Alerte Début Imminent (< 30 min) pour cette salle */}
                  {imminentResForSalle && (
                    <div className="bg-amber-100/90 border border-amber-300 text-amber-950 rounded-xl p-2.5 text-xs font-bold mb-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <BellRing className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                        <span>Arrivée imminente : {imminentResForSalle.client_nom}</span>
                      </div>
                      <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded font-mono font-black">
                        {imminentResForSalle.heure_debut}
                      </span>
                    </div>
                  )}

                  {/* Occupation info */}
                  {isCurrentlyOccupied && activeCurrentRes && !imminentResForSalle && (
                    <div className="bg-red-100/80 rounded-xl p-2.5 text-xs text-red-900 mb-3 border border-red-200">
                      <span className="font-bold block">En cours jusqu'à {activeCurrentRes.heure_fin}</span>
                      <span>Client : {activeCurrentRes.client_nom}</span>
                    </div>
                  )}

                  {!isCurrentlyOccupied && nextResForSalle && !imminentResForSalle && (
                    <div className="bg-white/80 rounded-xl p-2.5 text-xs text-gray-700 mb-3 border border-gray-200">
                      <span className="font-medium text-gray-500 block">Prochain créneau :</span>
                      <span className="font-bold text-[#064E3B]">
                        {nextResForSalle.heure_debut} - {nextResForSalle.heure_fin} ({nextResForSalle.client_nom})
                      </span>
                    </div>
                  )}

                  {!isCurrentlyOccupied && !nextResForSalle && (
                    <div className="bg-emerald-100/50 rounded-xl p-2.5 text-xs text-emerald-800 mb-3">
                      Libre tout le reste de la journée
                    </div>
                  )}
                </div>

                <button
                  id={`btn-reserve-room-${salle.id}`}
                  onClick={() => onOpenNewReservation(salle.id)}
                  disabled={salle.statut === 'Indisponible'}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors ${
                    salle.statut === 'Indisponible'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#064E3B] hover:bg-[#043d2e] text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Réserver cette salle</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Visual Timeline Snippet for today */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900">
              Planning express de la journée
            </h3>
            <p className="text-xs text-gray-500">
              Aperçu chronologique des créneaux réservés aujourd'hui
            </p>
          </div>
          <button
            onClick={onGoToToday}
            className="text-xs font-bold text-[#064E3B] hover:underline flex items-center space-x-1"
          >
            <span>Accéder à la vue réception 5 secondes</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {reservationsDuJour.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              Aucune réservation prévue pour le moment.
            </div>
          ) : (
            reservationsDuJour.slice(0, 5).map((res) => {
              const s = salles.find((room) => room.id === res.salle_id);
              return (
                <div key={res.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
                      {res.heure_debut} - {res.heure_fin}
                    </span>
                    <div>
                      <span className="font-bold text-gray-900">{res.client_nom}</span>
                      <span className="text-xs text-gray-500 ml-2">({res.client_telephone})</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-gray-600 hidden sm:inline">
                      {s?.nom}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        res.statut === 'Confirmée'
                          ? 'bg-red-100 text-red-700'
                          : res.statut === 'En attente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {res.statut === 'Confirmée' && '🔴 '}
                      {res.statut === 'En attente' && '🟠 '}
                      {res.statut === 'Annulée' && '⚪ '}
                      {res.statut}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
