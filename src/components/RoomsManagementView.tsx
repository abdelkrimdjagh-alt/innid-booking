import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Power,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Salle } from '../types';
import { enregistrerSalle, toggleStatutSalle, supprimerSalle } from '../services/storage';

interface RoomsManagementViewProps {
  salles: Salle[];
  onRefreshSalles: () => void;
  isAdmin: boolean;
}

export const RoomsManagementView: React.FC<RoomsManagementViewProps> = ({
  salles,
  onRefreshSalles,
  isAdmin,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);

  // Form states
  const [nom, setNom] = useState('');
  const [capacite, setCapacite] = useState(10);
  const [description, setDescription] = useState('');
  const [statut, setStatut] = useState<'Active' | 'Indisponible'>('Active');
  const [equipementsText, setEquipementsText] = useState('');

  const handleOpenAdd = () => {
    setEditingSalle(null);
    setNom('');
    setCapacite(15);
    setDescription('');
    setStatut('Active');
    setEquipementsText('Wifi Fibre, Écran de projection, Climatisation');
    setShowAddForm(true);
  };

  const handleOpenEdit = (salle: Salle) => {
    setEditingSalle(salle);
    setNom(salle.nom);
    setCapacite(salle.capacite);
    setDescription(salle.description || '');
    setStatut(salle.statut);
    setEquipementsText((salle.equipements || []).join(', '));
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || capacite <= 0) return;

    const equipements = equipementsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    enregistrerSalle({
      id: editingSalle?.id,
      nom: nom.trim(),
      capacite: Number(capacite),
      description: description.trim(),
      statut,
      equipements,
    });

    setShowAddForm(false);
    onRefreshSalles();
  };

  const handleToggle = (id: string) => {
    toggleStatutSalle(id);
    onRefreshSalles();
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette salle ? Toutes ses réservations associées seront également impactées.')) {
      supprimerSalle(id);
      onRefreshSalles();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Configuration Espaces</span>
          </div>
          <h2 className="text-2xl font-black text-[#064E3B] tracking-tight">
            GESTION DES SALLES INNID
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ajoutez, configurez et gérez la disponibilité des espaces de réunion et coworking
          </p>
        </div>

        <button
          id="btn-open-add-room"
          onClick={handleOpenAdd}
          className="bg-[#064E3B] hover:bg-[#043d2e] text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#F59E0B]" />
          <span>+ Ajouter une salle</span>
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#064E3B] flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#F59E0B]" />
                <span>{editingSalle ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}</span>
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  NOM DE LA SALLE *
                </label>
                <input
                  id="input-salle-nom"
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Salle conférence, Espace créatif..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    CAPACITÉ (PERSONNES) *
                  </label>
                  <input
                    id="input-salle-capacite"
                    type="number"
                    required
                    min="1"
                    max="500"
                    value={capacite}
                    onChange={(e) => setCapacite(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    STATUT INITIAL
                  </label>
                  <select
                    id="select-salle-statut"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value as 'Active' | 'Indisponible')}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                  >
                    <option value="Active">🟢 Active (disponible)</option>
                    <option value="Indisponible">🔴 Indisponible (maintenance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  id="input-salle-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la salle et usages recommandés..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  ÉQUIPEMENTS (séparés par des virgules)
                </label>
                <input
                  id="input-salle-equipements"
                  type="text"
                  value={equipementsText}
                  onChange={(e) => setEquipementsText(e.target.value)}
                  placeholder="Écran 4K, Microphones, Wifi Fibre, Tableau blanc..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  id="btn-save-room"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-black transition-colors shadow-sm"
                >
                  {editingSalle ? 'Enregistrer modifications' : 'Créer la salle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salles.map((salle) => {
          const isActive = salle.statut === 'Active';

          return (
            <div
              key={salle.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-xs flex flex-col justify-between ${
                isActive ? 'border-gray-200 hover:border-emerald-500' : 'border-red-200 bg-red-50/20'
              }`}
            >
              <div>
                {/* Header of card */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5 text-[#064E3B]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 leading-snug">
                        {salle.nom}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>Capacité : <strong>{salle.capacite} personnes</strong></span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center space-x-1 ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span>{isActive ? '🟢 Active' : '🔴 Indisponible'}</span>
                  </span>
                </div>

                <p className="text-xs text-gray-600 my-3 leading-relaxed">
                  {salle.description || 'Aucune description spécifique.'}
                </p>

                {/* Equipements */}
                {salle.equipements && salle.equipements.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Équipements inclus :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {salle.equipements.map((eq, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  id={`btn-toggle-salle-${salle.id}`}
                  onClick={() => handleToggle(salle.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title={isActive ? 'Désactiver temporairement' : 'Réactiver cette salle'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Désactiver temporairement' : 'Réactiver la salle'}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    id={`btn-edit-salle-${salle.id}`}
                    onClick={() => handleOpenEdit(salle)}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Modifier la salle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-delete-salle-${salle.id}`}
                    onClick={() => handleDelete(salle.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                    title="Supprimer la salle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
