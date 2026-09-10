import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Users,
  Info,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
import { Salle, Reservation } from '../types';

interface VisualCalendarViewProps {
  salles: Salle[];
  reservations: Reservation[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenNewReservation: (prefillSalleId?: string, prefillHeure?: string) => void;
  onSelectReservation: (reservation: Reservation) => void;
}

// Hours of the day from 08:00 to 19:00 (end 20:00)
const HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export const VisualCalendarView: React.FC<VisualCalendarViewProps> = ({
  salles,
  reservations,
  selectedDate,
  setSelectedDate,
  onOpenNewReservation,
  onSelectReservation,
}) => {
  const [viewMode, setViewMode] = useState<'jour' | 'semaine'>('jour');
  const [selectedSalleFilter, setSelectedSalleFilter] = useState<string>('all');

  const activeSalles = salles.filter((s) => s.statut === 'Active');
  const displayedSalles =
    selectedSalleFilter === 'all'
      ? activeSalles
      : activeSalles.filter((s) => s.id === selectedSalleFilter);

  // Helper to get day reservations
  const getReservationsForDate = (dateStr: string) => {
    return reservations.filter((r) => r.date === dateStr && r.statut !== 'Annulée');
  };

  // Check which reservation covers this hour block [hour, nextHour]
  const getReservationForSlot = (salleId: string, hourStr: string, dateStr: string) => {
    const dayRes = getReservationsForDate(dateStr);
    const hourNum = parseInt(hourStr.split(':')[0], 10);
    const nextHourNum = hourNum + 1;
    const nextHourStr = `${nextHourNum < 10 ? '0' : ''}${nextHourNum}:00`;

    return dayRes.find((r) => {
      if (r.salle_id !== salleId) return false;
      // Overlap with this 1-hour interval [hourStr, nextHourStr]
      return r.heure_debut < nextHourStr && r.heure_fin > hourStr;
    });
  };

  // Helper to format date label
  const formatDateTitle = (dateStr: string) => {
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

  // Generate 7 days for week view
  const getWeekDays = (baseDateStr: string) => {
    const baseDate = new Date(baseDateStr);
    const dayOfWeek = baseDate.getDay(); // 0 is Sunday, 1 is Monday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + distanceToMonday);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d.toISOString().split('T')[0]);
    }
    return weekDays;
  };

  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#064E3B]">
              PLANNING VISUEL INNID
            </h2>
            <p className="text-xs text-gray-500 capitalize">
              {formatDateTitle(selectedDate)}
            </p>
          </div>
        </div>

        {/* View Switcher (Jour / Semaine) & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Salles dropdown filter */}
          <select
            id="select-calendar-room-filter"
            value={selectedSalleFilter}
            onChange={(e) => setSelectedSalleFilter(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-[#064E3B]"
          >
            <option value="all">Toutes les salles ({activeSalles.length})</option>
            {activeSalles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom} ({s.capacite} pers)
              </option>
            ))}
          </select>

          {/* Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              id="btn-view-jour"
              onClick={() => setViewMode('jour')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'jour'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Vue Journée</span>
            </button>

            <button
              id="btn-view-semaine"
              onClick={() => setViewMode('semaine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'semaine'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Vue Semaine</span>
            </button>
          </div>

          {/* Quick Add Reservation */}
          <button
            id="btn-cal-add"
            onClick={() => onOpenNewReservation()}
            className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#F59E0B]" />
            <span>Réserver</span>
          </button>
        </div>
      </div>

      {/* Official Color Legend matching prompt specifications */}
      <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 font-bold text-[#064E3B]">
          <Info className="w-4 h-4 text-[#F59E0B]" />
          <span>Code Couleurs INNID :</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-semibold text-gray-700">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span>🟢 Disponible (Libre)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200"></span>
            <span>🔴 Confirmée</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
            <span>🟠 En attente</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-400 ring-2 ring-gray-200"></span>
            <span>⚪ Annulée</span>
          </div>
        </div>

        <span className="text-[11px] text-gray-500 italic hidden lg:inline">
          * Cliquez sur une case verte pour réserver ce créneau instantanément.
        </span>
      </div>

      {/* Grid Content: Day View */}
      {viewMode === 'jour' ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#064E3B] text-white">
                  <th className="py-3.5 px-4 text-xs font-bold tracking-wider uppercase w-28 border-r border-emerald-800">
                    HEURE
                  </th>
                  {displayedSalles.map((salle) => (
                    <th
                      key={salle.id}
                      className="py-3.5 px-4 text-xs font-extrabold tracking-wider border-r border-emerald-800 last:border-r-0"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold">{salle.nom}</span>
                          <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full font-normal">
                            {salle.total_chaises ? `${salle.total_chaises} chaises` : `${salle.capacite} pers.`}
                          </span>
                        </div>
                        {salle.prix_heure && (
                          <span className="text-[10px] text-[#F59E0B] font-mono">
                            {salle.prix_heure.toLocaleString()} DA / h
                          </span>
                        )}
                        {!salle.prix_heure && salle.prix_demi_journee && (
                          <span className="text-[10px] text-[#F59E0B] font-mono">
                            1/2j: {salle.prix_demi_journee.toLocaleString()} DA
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {HOURS.map((hour) => (
                  <tr key={hour} className="hover:bg-gray-50/70 transition-colors">
                    {/* Hour Column */}
                    <td className="py-3 px-4 font-mono font-bold text-xs text-gray-700 bg-gray-50/80 border-r border-gray-200">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{hour}</span>
                      </div>
                    </td>

                    {/* Room Columns */}
                    {displayedSalles.map((salle) => {
                      const res = getReservationForSlot(salle.id, hour, selectedDate);

                      if (!res) {
                        // Slot is Libre / Available
                        return (
                          <td
                            key={salle.id}
                            className="py-2.5 px-3 border-r border-gray-200 last:border-r-0"
                          >
                            <button
                              id={`slot-free-${salle.id}-${hour}`}
                              onClick={() => onOpenNewReservation(salle.id, hour)}
                              className="w-full py-2 px-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
                              title={`Réserver ${salle.nom} à ${hour}`}
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>🟢 Libre</span>
                              </span>
                              <span className="text-[10px] text-emerald-600 font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                                + Réserver
                              </span>
                            </button>
                          </td>
                        );
                      }

                      // Slot is Occupied
                      const isConfirmee = res.statut === 'Confirmée';
                      const isEnAttente = res.statut === 'En attente';

                      return (
                        <td
                          key={salle.id}
                          className="py-2 px-3 border-r border-gray-200 last:border-r-0"
                        >
                          <div
                            id={`slot-busy-${res.id}`}
                            onClick={() => onSelectReservation(res)}
                            className={`w-full py-2 px-3 rounded-xl border text-xs cursor-pointer transition-all shadow-xs hover:shadow-md ${
                              isConfirmee
                                ? 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
                                : isEnAttente
                                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold truncate flex items-center space-x-1">
                                <span>{isConfirmee ? '🔴' : isEnAttente ? '🟠' : '⚪'}</span>
                                <span className="truncate">{res.client_nom}</span>
                              </span>
                              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/70">
                                {res.heure_debut}-{res.heure_fin}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-1 text-[11px] opacity-85">
                              <span>{res.type}</span>
                              <span className="flex items-center space-x-0.5">
                                <Users className="w-3 h-3 inline" />
                                <span>{res.nombre_personnes}p</span>
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Week View */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h3 className="font-extrabold text-base text-[#064E3B]">
              Semaine du {formatDateTitle(weekDays[0])} au {formatDateTitle(weekDays[6])}
            </h3>
            <span className="text-xs text-gray-500">
              Cliquez sur un jour pour basculer en vue détaillée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((dayStr) => {
              const d = new Date(dayStr);
              const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
              const dayNum = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
              const isCurrentSelected = dayStr === selectedDate;
              const dayReservations = getReservationsForDate(dayStr);

              return (
                <div
                  key={dayStr}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`rounded-2xl p-3 border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[220px] ${
                    isCurrentSelected
                      ? 'border-[#064E3B] bg-emerald-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm uppercase text-[#064E3B]">
                        {dayName}
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-700 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        {dayNum}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3">
                      {dayReservations.length === 0 ? (
                        <div className="text-[11px] text-gray-400 italic py-4 text-center">
                          🟢 100% Libre
                        </div>
                      ) : (
                        dayReservations.slice(0, 4).map((r) => {
                          const s = salles.find((room) => room.id === r.salle_id);
                          return (
                            <div
                              key={r.id}
                              className={`p-1.5 rounded-lg text-[10px] font-semibold border ${
                                r.statut === 'Confirmée'
                                  ? 'bg-red-50 text-red-900 border-red-200'
                                  : 'bg-amber-50 text-amber-900 border-amber-200'
                              }`}
                            >
                              <div className="font-bold truncate">{r.client_nom}</div>
                              <div className="text-gray-500 flex justify-between">
                                <span>{r.heure_debut}-{r.heure_fin}</span>
                                <span className="truncate ml-1">{s?.nom.replace('Salle ', '')}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      {dayReservations.length > 4 && (
                        <span className="text-[10px] text-gray-500 font-bold block text-center">
                          +{dayReservations.length - 4} autres
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(dayStr);
                      onOpenNewReservation();
                    }}
                    className="mt-3 w-full py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-[10px] font-bold text-[#064E3B] transition-colors"
                  >
                    + Réserver
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
