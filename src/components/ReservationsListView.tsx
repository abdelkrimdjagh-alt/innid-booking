import React, { useState, useMemo } from 'react';
import {
  Search,
  Phone,
  Calendar,
  Building2,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit,
  Ban,
  Clock,
  Users,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Reservation, Salle, StatutReservation } from '../types';

interface ReservationsListViewProps {
  salles: Salle[];
  reservations: Reservation[];
  onOpenNewReservation: () => void;
  onSelectReservation: (res: Reservation) => void;
  onEditReservation: (res: Reservation) => void;
  onCancelReservation: (id: string) => void;
  onDeleteReservation: (id: string) => void;
}

export const ReservationsListView: React.FC<ReservationsListViewProps> = ({
  salles,
  reservations,
  onOpenNewReservation,
  onSelectReservation,
  onEditReservation,
  onCancelReservation,
  onDeleteReservation,
}) => {
  // Filter states
  const [searchNom, setSearchNom] = useState('');
  const [searchTel, setSearchTel] = useState('');
  const [filterSalleId, setFilterSalleId] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter logic
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      if (searchNom.trim()) {
        const query = searchNom.toLowerCase().trim();
        if (!res.client_nom.toLowerCase().includes(query)) return false;
      }

      if (searchTel.trim()) {
        const query = searchTel.trim().replace(/\s+/g, '');
        const resTel = (res.client_telephone || '').replace(/\s+/g, '');
        if (!resTel.includes(query)) return false;
      }

      if (filterSalleId !== 'all' && res.salle_id !== filterSalleId) {
        return false;
      }

      if (filterDate && res.date !== filterDate) {
        return false;
      }

      if (filterStatut !== 'all' && res.statut !== filterStatut) {
        return false;
      }

      if (filterType !== 'all' && res.type !== filterType) {
        return false;
      }

      return true;
    });
  }, [reservations, searchNom, searchTel, filterSalleId, filterDate, filterStatut, filterType]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Client', 'Téléphone', 'Salle', 'Date', 'Début', 'Fin', 'Personnes', 'Type', 'Statut', 'Notes'];
    const rows = filteredReservations.map((r) => {
      const s = salles.find((salle) => salle.id === r.salle_id);
      return [
        r.id,
        `"${r.client_nom}"`,
        `"${r.client_telephone}"`,
        `"${s?.nom || 'Inconnue'}"`,
        r.date,
        r.heure_debut,
        r.heure_fin,
        r.nombre_personnes,
        r.type,
        r.statut,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reservations_innid_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearchNom('');
    setSearchTel('');
    setFilterSalleId('all');
    setFilterDate('');
    setFilterStatut('all');
    setFilterType('all');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#064E3B] flex items-center space-x-2">
              <Search className="w-5 h-5 text-[#F59E0B]" />
              <span>Recherche & Gestion des Réservations</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Filtrez par nom client, téléphone, salle, date et statut
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              title="Exporter au format CSV (Excel)"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#064E3B]" />
              <span>Exporter CSV</span>
            </button>

            <button
              onClick={onOpenNewReservation}
              className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#F59E0B]" />
              <span>+ Nouvelle réservation</span>
            </button>
          </div>
        </div>

        {/* Filters Multi-Criteria Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-gray-100">
          {/* 🔎 Nom Client */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              🔎 Nom client
            </label>
            <input
              id="filter-client-nom"
              type="text"
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
              placeholder="ex: Ahmed, Sara..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            />
          </div>

          {/* 📞 Téléphone */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              📞 Téléphone
            </label>
            <input
              id="filter-client-tel"
              type="text"
              value={searchTel}
              onChange={(e) => setSearchTel(e.target.value)}
              placeholder="ex: 06 52..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            />
          </div>

          {/* 🏢 Salle */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              🏢 Salle
            </label>
            <select
              id="filter-salle"
              value={filterSalleId}
              onChange={(e) => setFilterSalleId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            >
              <option value="all">Toutes les salles</option>
              {salles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>

          {/* 📅 Date */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              📅 Date
            </label>
            <input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            />
          </div>

          {/* 🟢 Statut */}
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              🟢 Statut
            </label>
            <select
              id="filter-statut"
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
            >
              <option value="all">Tous les statuts</option>
              <option value="Confirmée">🔴 Confirmée</option>
              <option value="En attente">🟠 En attente</option>
              <option value="Annulée">⚪ Annulée</option>
            </select>
          </div>
        </div>

        {/* Filter results info & Reset button */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Résultats : <strong>{filteredReservations.length}</strong> réservation(s) trouvée(s)
          </span>

          {(searchNom || searchTel || filterSalleId !== 'all' || filterDate || filterStatut !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-[#064E3B] hover:underline font-bold"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4">Client & Contact</th>
                <th className="py-3.5 px-4">Salle</th>
                <th className="py-3.5 px-4">Date & Horaire</th>
                <th className="py-3.5 px-4">Détails</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Aucune réservation ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const s = salles.find((room) => room.id === res.salle_id);
                  return (
                    <tr
                      key={res.id}
                      onClick={() => onSelectReservation(res)}
                      className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                    >
                      {/* Client info */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-gray-900 text-sm">
                          {res.client_nom}
                        </div>
                        <div className="font-mono text-gray-500 flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{res.client_telephone}</span>
                        </div>
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#064E3B] flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>{s?.nom || 'Salle'}</span>
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          Capacité: {s?.capacite}p
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">
                          {res.date}
                        </div>
                        <div className="font-mono text-emerald-800 font-bold bg-emerald-50 inline-block px-1.5 py-0.5 rounded text-[11px] border border-emerald-200 mt-0.5">
                          {res.heure_debut} - {res.heure_fin}
                        </div>
                      </td>

                      {/* Type & People */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-700 block">
                          {res.type}
                        </span>
                        <span className="text-gray-500">
                          {res.nombre_personnes} personne(s)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-extrabold px-2.5 py-1 rounded-full text-[11px] inline-flex items-center space-x-1 ${
                            res.statut === 'Confirmée'
                              ? 'bg-red-100 text-red-700'
                              : res.statut === 'En attente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span>{res.statut === 'Confirmée' ? '🔴' : res.statut === 'En attente' ? '🟠' : '⚪'}</span>
                          <span>{res.statut}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            id={`btn-edit-${res.id}`}
                            onClick={() => onEditReservation(res)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#064E3B] transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {res.statut !== 'Annulée' && (
                            <button
                              id={`btn-cancel-${res.id}`}
                              onClick={() => onCancelReservation(res.id)}
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 hover:text-amber-800 transition-colors"
                              title="Annuler"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            id={`btn-del-${res.id}`}
                            onClick={() => {
                              if (confirm('Supprimer définitivement cette réservation ?')) {
                                onDeleteReservation(res.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
