import React, { useState, useMemo } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Plus,
  Coffee,
  Wifi,
  Zap,
  Info,
} from 'lucide-react';
import { Salle, Reservation, ChaiseStatus } from '../types';
import { getChaisesStatus, PACKS_COWORKING } from '../services/storage';

interface CoworkingSeatsViewProps {
  coworkingSalle?: Salle;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  onOpenReservationWithSeats: (chaises: number[], startTime: string, endTime: string) => void;
  onSelectReservation: (res: Reservation) => void;
}

export const CoworkingSeatsView: React.FC<CoworkingSeatsViewProps> = ({
  coworkingSalle,
  selectedDate,
  setSelectedDate,
  onOpenReservationWithSeats,
  onSelectReservation,
}) => {
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '09:00',
    end: '18:00',
  });

  const [selectedChairs, setSelectedChairs] = useState<number[]>([]);

  // Get status of all 45 chairs for the selected date and time range
  const chairsStatus: ChaiseStatus[] = useMemo(() => {
    return getChaisesStatus(selectedDate, timeSlot.start, timeSlot.end);
  }, [selectedDate, timeSlot]);

  // Statistics
  const libresCount = chairsStatus.filter((c) => c.statut === 'Libre').length;
  const occupeesCount = chairsStatus.filter((c) => c.statut === 'Occupée').length;
  const attenteCount = chairsStatus.filter((c) => c.statut === 'En attente').length;
  const tauxOccupation = Math.round(((occupeesCount + attenteCount) / 45) * 100);

  const toggleChairSelection = (chairNum: number, status: string) => {
    if (status !== 'Libre') return; // Cannot select occupied chair

    setSelectedChairs((prev) => {
      if (prev.includes(chairNum)) {
        return prev.filter((n) => n !== chairNum);
      } else {
        return [...prev, chairNum].sort((a, b) => a - b);
      }
    });
  };

  const handleSelectAllFree = () => {
    const freeChairs = chairsStatus.filter((c) => c.statut === 'Libre').map((c) => c.numero);
    setSelectedChairs(freeChairs);
  };

  const handleClearSelection = () => {
    setSelectedChairs([]);
  };

  const handleProceedBooking = () => {
    if (selectedChairs.length === 0) return;
    onOpenReservationWithSeats(selectedChairs, timeSlot.start, timeSlot.end);
  };

  // Group chairs into 5 distinct islands/zones for aesthetic workspace layout
  const zones = [
    { titre: 'Zone A - Îlot Startup & Pro (Chaises 1 à 10)', chaises: chairsStatus.slice(0, 10) },
    { titre: 'Zone B - Îlot Flex & Nomade (Chaises 11 à 20)', chaises: chairsStatus.slice(10, 20) },
    { titre: 'Zone C - Îlot Étudiant & Solo (Chaises 21 à 30)', chaises: chairsStatus.slice(20, 30) },
    { titre: 'Zone D - Îlot Silencieux / Focus (Chaises 31 à 40)', chaises: chairsStatus.slice(30, 40) },
    { titre: 'Zone E - Îlot Collaboratif (Chaises 41 à 45)', chaises: chairsStatus.slice(40, 45) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Coworking Highlights */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Espace Coworking INNID • 45 Chaises</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
            PLAN DES 45 CHAISES & POSTES COWORKING
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Réservez une chaise individuelle pour le Pack Solo/Étudiant ou plusieurs chaises côte à côte pour votre équipe Start-up ou Pro avec réduction groupe automatique.
          </p>
        </div>

        {/* Date & Time Slot Selector */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold text-[#064E3B] focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Créneau</label>
            <div className="flex items-center space-x-1">
              <input
                type="time"
                value={timeSlot.start}
                onChange={(e) => setTimeSlot({ ...timeSlot, start: e.target.value })}
                className="bg-white border border-gray-300 px-2 py-1.5 rounded-xl text-xs font-mono font-bold"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="time"
                value={timeSlot.end}
                onChange={(e) => setTimeSlot({ ...timeSlot, end: e.target.value })}
                className="bg-white border border-gray-300 px-2 py-1.5 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Interactive Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Chaises</span>
            <span className="text-2xl font-black text-gray-900">45</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            🪑
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">🟢 Chaises Libres</span>
            <span className="text-2xl font-black text-emerald-700">{libresCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            {libresCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">🔴 Chaises Occupées</span>
            <span className="text-2xl font-black text-red-600">{occupeesCount + attenteCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            {tauxOccupation}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider block">Sélectionnées</span>
            <span className="text-2xl font-black text-[#064E3B]">{selectedChairs.length}</span>
          </div>
          {selectedChairs.length > 0 ? (
            <button
              onClick={handleProceedBooking}
              className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md animate-pulse"
            >
              Réserver ({selectedChairs.length})
            </button>
          ) : (
            <span className="text-xs text-gray-400 font-semibold">Cliquez une chaise</span>
          )}
        </div>
      </div>

      {/* Action bar for multi-chair booking */}
      {selectedChairs.length > 0 && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3 text-xs">
            <span className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-black">
              {selectedChairs.length}
            </span>
            <div>
              <p className="font-extrabold text-sm">
                Chaises sélectionnées : {selectedChairs.join(', ')}
              </p>
              <p className="text-emerald-200 text-[11px]">
                {selectedChairs.length >= 6
                  ? 'Équipe de 6 à 10 pers. : Tarif groupe réduit activé !'
                  : selectedChairs.length >= 3
                  ? 'Équipe de 3 à 5 pers. : Tarif groupe avantageux activé !'
                  : 'Pack Solo / Étudiant ou Pass Coworking individuel'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearSelection}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Effacer
            </button>
            <button
              onClick={handleProceedBooking}
              className="px-5 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#d98206] text-white text-xs font-black shadow-md transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Réserver ces {selectedChairs.length} chaise(s)</span>
            </button>
          </div>
        </div>
      )}

      {/* Visual Interactive Map of the 45 Chairs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-[#064E3B] flex items-center space-x-2">
              <span>Plan Interactif des Postes de Travail (Blida)</span>
            </h3>
            <p className="text-xs text-gray-500">
              Cliquez sur une chaise verte pour la sélectionner ou sur une chaise occupée pour voir les détails.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs font-bold">
            <span className="flex items-center space-x-1 text-emerald-800">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Libre</span>
            </span>
            <span className="flex items-center space-x-1 text-blue-800">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Sélectionnée</span>
            </span>
            <span className="flex items-center space-x-1 text-red-700">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Occupée</span>
            </span>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="space-y-6">
          {zones.map((zone, zIdx) => (
            <div key={zIdx} className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  {zone.titre}
                </span>
                <span className="text-[11px] text-gray-500 font-semibold">
                  {zone.chaises.filter((c) => c.statut === 'Libre').length} libre(s) sur {zone.chaises.length}
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                {zone.chaises.map((chaise) => {
                  const isSelected = selectedChairs.includes(chaise.numero);
                  const isFree = chaise.statut === 'Libre';
                  const isOccupied = chaise.statut === 'Occupée';

                  return (
                    <button
                      key={chaise.numero}
                      id={`chair-btn-${chaise.numero}`}
                      onClick={() => {
                        if (isFree) {
                          toggleChairSelection(chaise.numero, chaise.statut);
                        } else if (chaise.reservation) {
                          onSelectReservation(chaise.reservation);
                        }
                      }}
                      className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all relative group ${
                        isSelected
                          ? 'bg-blue-600 border-blue-700 text-white shadow-md scale-105 ring-2 ring-blue-400'
                          : isFree
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer'
                          : isOccupied
                          ? 'bg-red-50 border-red-300 text-red-900 cursor-pointer hover:bg-red-100'
                          : 'bg-amber-50 border-amber-300 text-amber-900'
                      }`}
                      title={
                        isFree
                          ? `Chaise n°${chaise.numero} (Libre) - Cliquer pour sélectionner`
                          : `Chaise n°${chaise.numero} occupée par ${chaise.reservation?.client_nom}`
                      }
                    >
                      <span className="text-sm">🪑</span>
                      <span className="text-[11px] font-black leading-none mt-1">
                        #{chaise.numero}
                      </span>

                      {/* Micro Status badge */}
                      <span
                        className={`text-[9px] font-extrabold uppercase mt-0.5 ${
                          isSelected
                            ? 'text-blue-100'
                            : isFree
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {isSelected ? 'Choisie' : isFree ? 'Libre' : 'Occupée'}
                      </span>

                      {/* Tooltip hover info */}
                      {!isFree && chaise.reservation && (
                        <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none">
                          <p className="font-bold">{chaise.reservation.client_nom}</p>
                          <p className="text-gray-300">
                            {chaise.reservation.heure_debut} - {chaise.reservation.heure_fin}
                          </p>
                          <p className="text-[#F59E0B]">{chaise.reservation.type}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packs Overview Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#064E3B] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Packs Coworking Disponibles pour les 45 Chaises</span>
          </h3>
          <span className="text-xs text-gray-500 font-semibold">Tarifs mensuels & journaliers Blida</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PACKS_COWORKING.map((pack) => (
            <div
              key={pack.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                pack.populaire
                  ? 'border-[#F59E0B] bg-amber-50/30 ring-1 ring-[#F59E0B]'
                  : 'border-gray-200 bg-gray-50/50 hover:bg-white'
              }`}
            >
              <div>
                {pack.populaire && (
                  <span className="bg-[#F59E0B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1">
                    Populaire
                  </span>
                )}
                <h4 className="font-black text-sm text-gray-900">{pack.nom}</h4>
                <p className="text-[11px] text-gray-500 mb-2">{pack.publicCible}</p>

                <div className="my-2 py-2 border-y border-gray-200">
                  <span className="text-lg font-black text-[#064E3B]">
                    {pack.prixBaseMensuel.toLocaleString()} DA
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {pack.id.startsWith('pass') ? '/ accès' : '/ mois (base)'}
                  </span>
                </div>

                <ul className="text-[11px] text-gray-600 space-y-1">
                  <li>• <strong>Accès :</strong> {pack.acces}</li>
                  <li>• <strong>Boissons :</strong> {pack.boissons}</li>
                  <li>• <strong>Groupe 3-5 :</strong> {pack.groupe3a5.toLocaleString()} DA/p</li>
                  <li>• <strong>Groupe 6-10 :</strong> {pack.groupe6a10.toLocaleString()} DA/p</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedChairs([1]);
                  onOpenReservationWithSeats([1], timeSlot.start, timeSlot.end);
                }}
                className="mt-3 w-full py-1.5 px-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white text-[11px] font-bold text-center transition-colors"
              >
                Choisir ce pack
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
