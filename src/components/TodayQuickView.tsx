import React, { useState } from 'react';
import {
  Clock,
  Building2,
  Phone,
  CheckCircle2,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Salle, Reservation } from '../types';

interface TodayQuickViewProps {
  salles: Salle[];
  reservations: Reservation[];
  selectedDate: string;
  onOpenNewReservation: () => void;
  onSelectReservation: (res: Reservation) => void;
}

export const TodayQuickView: React.FC<TodayQuickViewProps> = ({
  salles,
  reservations,
  selectedDate,
  onOpenNewReservation,
  onSelectReservation,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'upcoming' | 'ongoing'>('all');

  // Format date display
  const formatDateHeader = (dateStr: string) => {
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

  const currentTime = '11:30';

  // Day reservations sorted by start time
  const dayReservations = reservations
    .filter((r) => r.date === selectedDate && r.statut !== 'Annulée')
    .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

  const filteredList = dayReservations.filter((r) => {
    if (filterPeriod === 'ongoing') {
      return r.heure_debut <= currentTime && r.heure_fin > currentTime;
    }
    if (filterPeriod === 'upcoming') {
      return r.heure_debut > currentTime;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Reception Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Vue Réception Rapide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
            RÉSERVATIONS AUJOURD'HUI
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1 capitalize">
            {formatDateHeader(selectedDate)}
          </p>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            ⚡ Comprendre l'activité de la journée en moins de 5 secondes
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-today-new-res"
            onClick={onOpenNewReservation}
            className="w-full sm:w-auto bg-[#064E3B] hover:bg-[#043d2e] text-white px-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-[#F59E0B]" />
            <span>+ Nouvelle réservation</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === 'all'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes ({dayReservations.length})
          </button>

          <button
            onClick={() => setFilterPeriod('ongoing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === 'ongoing'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En cours actuellement
          </button>

          <button
            onClick={() => setFilterPeriod('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === 'upcoming'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            À venir
          </button>
        </div>

        <span className="text-xs text-gray-400 font-mono hidden md:inline">
          Heure actuelle de référence: {currentTime}
        </span>
      </div>

      {/* Timeline Cards List - Designed for 5 seconds instant clarity */}
      <div className="space-y-3.5">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg">Aucune réservation sur ce créneau</h3>
            <p className="text-gray-500 text-sm mt-1">
              Toutes les salles sont actuellement libres et disponibles.
            </p>
            <button
              onClick={onOpenNewReservation}
              className="mt-4 bg-[#064E3B] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              + Enregistrer un client
            </button>
          </div>
        ) : (
          filteredList.map((res) => {
            const salle = salles.find((s) => s.id === res.salle_id);
            const isOngoing = res.heure_debut <= currentTime && res.heure_fin > currentTime;
            const isPast = res.heure_fin <= currentTime;

            return (
              <div
                key={res.id}
                onClick={() => onSelectReservation(res)}
                className={`bg-white rounded-2xl p-5 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isOngoing
                    ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-200'
                    : isPast
                    ? 'border-gray-200 opacity-70 bg-gray-50/50'
                    : 'border-gray-200 hover:border-[#064E3B]'
                }`}
              >
                {/* Left: Time Badge & Client & Room */}
                <div className="flex items-start sm:items-center space-x-4">
                  {/* Huge prominent Time Slot badge */}
                  <div
                    className={`w-28 sm:w-32 py-3 px-2 rounded-xl flex flex-col items-center justify-center text-center font-mono shrink-0 shadow-xs ${
                      isOngoing
                        ? 'bg-[#064E3B] text-white'
                        : isPast
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <div className="flex items-center space-x-1 text-[11px] font-medium opacity-80 mb-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{isOngoing ? 'EN COURS' : isPast ? 'TERMINÉ' : 'HORAIRE'}</span>
                    </div>
                    <span className="font-extrabold text-sm sm:text-base leading-tight">
                      {res.heure_debut} - {res.heure_fin}
                    </span>
                  </div>

                  {/* Client & Room details */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-lg text-gray-900 leading-tight">
                        {res.client_nom}
                      </h3>
                      {res.statut === 'Confirmée' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700">
                          🔴 Confirmée
                        </span>
                      )}
                      {res.statut === 'En attente' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                          🟠 En attente
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-semibold">
                      <span className="flex items-center space-x-1 text-[#064E3B] font-bold">
                        <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{salle?.nom || 'Salle'}</span>
                      </span>

                      <span className="text-gray-300">•</span>

                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{res.nombre_personnes} personnes ({res.type})</span>
                      </span>

                      <span className="text-gray-300">•</span>

                      <span className="flex items-center space-x-1 font-mono text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{res.client_telephone}</span>
                      </span>
                    </div>

                    {res.notes && (
                      <p className="text-xs text-gray-500 line-clamp-1 italic mt-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        "{res.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <a
                    href={`tel:${res.client_telephone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                    title={`Appeler ${res.client_nom}`}
                  >
                    <Phone className="w-4 h-4 text-[#064E3B]" />
                  </a>

                  <button
                    onClick={() => onSelectReservation(res)}
                    className="flex items-center space-x-1 px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                  >
                    <span>Détails</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
