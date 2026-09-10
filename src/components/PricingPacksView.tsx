import React, { useState } from 'react';
import {
  Tag,
  Check,
  Building2,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coffee,
  Printer,
  Calendar,
  Clock,
  Calculator,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { PACKS_COWORKING, OFFRES_PME, OFFRE_DOMICILIATION } from '../services/storage';
import { Salle } from '../types';

interface PricingPacksViewProps {
  salles: Salle[];
  onSelectPackBooking: (packType: string, nombrePersonnes?: number, salleId?: string) => void;
  onSelectRoomBooking: (salleId: string) => void;
}

export const PricingPacksView: React.FC<PricingPacksViewProps> = ({
  salles,
  onSelectPackBooking,
  onSelectRoomBooking,
}) => {
  const [activeSection, setActiveSection] = useState<'coworking' | 'salles' | 'pme' | 'domiciliation'>('coworking');

  // Interactive Quote Simulator
  const [simPack, setSimPack] = useState('Pack Start-up');
  const [simPersonnes, setSimPersonnes] = useState(4);

  const calculateSimulatorPrice = () => {
    let prixUnitaire = 8900;
    if (simPack === 'Pack Solo/Étudiant') {
      if (simPersonnes >= 6) prixUnitaire = 4500;
      else if (simPersonnes >= 3) prixUnitaire = 5000;
      else prixUnitaire = 5850;
    } else if (simPack === 'Pack Start-up') {
      if (simPersonnes >= 6) prixUnitaire = 7000;
      else if (simPersonnes >= 3) prixUnitaire = 7500;
      else prixUnitaire = 8900;
    } else if (simPack === 'Pack Pro') {
      if (simPersonnes >= 6) prixUnitaire = 16000;
      else if (simPersonnes >= 3) prixUnitaire = 17000;
      else prixUnitaire = 18900;
    } else if (simPack === 'Pass Journée') {
      if (simPersonnes >= 6) prixUnitaire = 800;
      else if (simPersonnes >= 3) prixUnitaire = 900;
      else prixUnitaire = 1000;
    }

    const total = prixUnitaire * simPersonnes;
    return { prixUnitaire, total };
  };

  const simResult = calculateSimulatorPrice();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4" />
            <span>Catalogue Officiel INNID Blida</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
            GRILLE TARIFAIRE & PACKS INNID
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Packs Coworking (45 chaises), Salles à la carte avec équipements inclus, Offres Entreprises PME clé en main et Domiciliation à Blida.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 self-start md:self-auto">
          <button
            onClick={() => setActiveSection('coworking')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'coworking'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🪑 Packs Coworking (45 pl.)
          </button>
          <button
            onClick={() => setActiveSection('salles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'salles'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏢 Salles à la Carte
          </button>
          <button
            onClick={() => setActiveSection('pme')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'pme'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💼 Offres PME Clé en Main
          </button>
          <button
            onClick={() => setActiveSection('domiciliation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'domiciliation'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📍 Domiciliation
          </button>
        </div>
      </div>

      {/* SECTION 1: PACKS COWORKING (45 CHAISES) */}
      {activeSection === 'coworking' && (
        <div className="space-y-8">
          {/* Official Comparison Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-[#064E3B]">
                  Packs Coworking & Solo (45 Chaises Disponibles)
                </h3>
                <p className="text-xs text-gray-500">
                  Idéal pour étudiants, freelances, porteurs de projets et équipes startups à Blida
                </p>
              </div>

              <span className="text-xs font-bold text-[#F59E0B] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                Tarifs dégressifs pour équipes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-950 text-white font-extrabold uppercase text-[11px]">
                    <th className="p-4">Prestations</th>
                    <th className="p-4">Pack Solo / Étudiant</th>
                    <th className="p-4 bg-emerald-900 text-[#F59E0B]">
                      Pack Start-up ★
                    </th>
                    <th className="p-4">Pack Pro</th>
                    <th className="p-4">Pass Heure / Journée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {/* Internet */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Internet</td>
                    <td className="p-4">Wifi Fibre</td>
                    <td className="p-4 font-semibold text-emerald-900">Wifi Fibre</td>
                    <td className="p-4">Wifi Fibre</td>
                    <td className="p-4">Wifi Fibre</td>
                  </tr>

                  {/* Boissons */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Boissons</td>
                    <td className="p-4">12 boissons / mois</td>
                    <td className="p-4 font-semibold text-emerald-900">16 boissons / mois</td>
                    <td className="p-4 font-semibold text-[#064E3B]">36 boissons / mois</td>
                    <td className="p-4">1 café + 1 eau / accès jour</td>
                  </tr>

                  {/* Impressions */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Impressions</td>
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 font-bold text-emerald-800">250 imp. / mois</td>
                    <td className="p-4">10 imp. / jour</td>
                  </tr>

                  {/* Réunion */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Salle Réunion</td>
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 text-gray-400">—</td>
                  </tr>

                  {/* Accueil visiteur */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Accueil Visiteur</td>
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 font-bold text-emerald-700">✓ Oui inclus</td>
                    <td className="p-4 font-bold text-emerald-700">✓ Oui inclus</td>
                    <td className="p-4 text-gray-400">—</td>
                  </tr>

                  {/* Fréquence / Horaires */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Fréquence / Horaires</td>
                    <td className="p-4">12 accès / mois (8h-20h)</td>
                    <td className="p-4">16 accès / mois (8h-20h)</td>
                    <td className="p-4 font-semibold text-[#064E3B]">24 accès / mois (8h-20h)</td>
                    <td className="p-4">Horaires 8h - 20h</td>
                  </tr>

                  {/* Tarif Base (Mensuel) */}
                  <tr className="bg-emerald-50/40">
                    <td className="p-4 font-black text-[#064E3B]">Tarif Base (Individuel)</td>
                    <td className="p-4 font-black text-base text-gray-900">5 850 DA</td>
                    <td className="p-4 font-black text-base text-[#064E3B]">8 900 DA</td>
                    <td className="p-4 font-black text-base text-gray-900">18 900 DA</td>
                    <td className="p-4 font-black text-sm text-gray-900">
                      300 DA / heure<br />1 000 DA / jour
                    </td>
                  </tr>

                  {/* Groupe 3-5 pers */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Groupe 3 - 5 pers.</td>
                    <td className="p-4 font-bold text-emerald-800">5 000 DA / pers</td>
                    <td className="p-4 font-bold text-emerald-800">7 500 DA / pers</td>
                    <td className="p-4 font-bold text-emerald-800">17 000 DA / pers</td>
                    <td className="p-4 text-gray-600">Tarif négociable</td>
                  </tr>

                  {/* Groupe 6-10 pers */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Groupe 6 - 10 pers.</td>
                    <td className="p-4 font-bold text-emerald-800">4 500 DA / pers</td>
                    <td className="p-4 font-bold text-emerald-800">7 000 DA / pers</td>
                    <td className="p-4 font-bold text-emerald-800">16 000 DA / pers</td>
                    <td className="p-4 text-gray-600">Tarif négociable</td>
                  </tr>

                  {/* Groupe +10 pers */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700 bg-gray-50/50">Groupe +10 pers.</td>
                    <td className="p-4 font-semibold text-[#F59E0B]">Tarif négociable</td>
                    <td className="p-4 font-semibold text-[#F59E0B]">Tarif négociable</td>
                    <td className="p-4 font-semibold text-[#F59E0B]">Tarif négociable</td>
                    <td className="p-4 font-semibold text-[#F59E0B]">Tarif négociable</td>
                  </tr>

                  {/* Boutons Action */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-bold text-gray-500">Action</td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectPackBooking('Pack Solo/Étudiant', 1)}
                        className="w-full py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold text-xs shadow-xs"
                      >
                        Réserver Solo
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectPackBooking('Pack Start-up', 4)}
                        className="w-full py-2 rounded-xl bg-[#F59E0B] hover:bg-[#d98206] text-white font-bold text-xs shadow-xs"
                      >
                        Réserver Start-up
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectPackBooking('Pack Pro', 1)}
                        className="w-full py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold text-xs shadow-xs"
                      >
                        Réserver Pro
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectPackBooking('Pass Journée', 1)}
                        className="w-full py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-xs"
                      >
                        Réserver Pass
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Group Simulator */}
          <div className="bg-gradient-to-br from-emerald-900 to-[#064E3B] text-white p-6 sm:p-8 rounded-3xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] uppercase">
                  <Calculator className="w-4 h-4" />
                  <span>Simulateur Tarif Équipe Coworking</span>
                </div>
                <h4 className="text-xl font-black">
                  Calculez immédiatement le tarif de votre équipe
                </h4>
                <p className="text-xs text-emerald-200 max-w-xl">
                  Sélectionnez le pack et le nombre de personnes pour appliquer automatiquement le tarif de groupe dégressif.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-200 mb-1">
                    Pack Choisi
                  </label>
                  <select
                    value={simPack}
                    onChange={(e) => setSimPack(e.target.value)}
                    className="bg-white text-gray-900 px-3 py-2 rounded-xl text-xs font-bold focus:outline-hidden"
                  >
                    <option value="Pack Solo/Étudiant">Pack Solo/Étudiant</option>
                    <option value="Pack Start-up">Pack Start-up</option>
                    <option value="Pack Pro">Pack Pro</option>
                    <option value="Pass Journée">Pass Journée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-200 mb-1">
                    Personnes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={simPersonnes}
                    onChange={(e) => setSimPersonnes(parseInt(e.target.value, 10) || 1)}
                    className="bg-white text-gray-900 px-3 py-2 rounded-xl text-xs font-bold w-20 focus:outline-hidden"
                  />
                </div>

                <div className="border-l border-white/20 pl-4">
                  <span className="text-[10px] uppercase text-emerald-200 block font-bold">
                    Montant Total Calculé
                  </span>
                  <span className="text-2xl font-black text-[#F59E0B]">
                    {simResult.total.toLocaleString()} DA
                  </span>
                  <span className="text-[10px] text-emerald-300 block">
                    soit {simResult.prixUnitaire.toLocaleString()} DA / personne
                  </span>
                </div>

                <button
                  onClick={() => onSelectPackBooking(simPack as any, simPersonnes)}
                  className="bg-[#F59E0B] hover:bg-[#d98206] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition-transform active:scale-95"
                >
                  Réserver ce devis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SALLES & ESPACES À LA CARTE */}
      {activeSection === 'salles' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <span className="font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Équipements inclus de base dans toutes les salles : Vidéoprojecteur, Tableau blanc, Climatisation, Wifi haut débit.</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-black text-[#064E3B]">
                ESPACES & SALLES (À LA CARTE)
              </h3>
              <p className="text-xs text-gray-500">
                Tarification transparente par heure, demi-journée (4h) et journée complète (9h-20h)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-extrabold uppercase text-[11px]">
                    <th className="p-4">Salle & Capacité</th>
                    <th className="p-4">Tarif Heure</th>
                    <th className="p-4">1/2 Journée (4H)</th>
                    <th className="p-4">Journée (9H - 20H)</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {/* Salle Réunion */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-gray-900 block">Salle Réunion</span>
                      <span className="text-gray-500">Capacité : 12 personnes</span>
                    </td>
                    <td className="p-4 font-bold text-[#064E3B]">900 DA</td>
                    <td className="p-4 font-bold text-gray-900">3 500 DA</td>
                    <td className="p-4 font-bold text-gray-900">6 000 DA</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectRoomBooking('1')}
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold"
                      >
                        Réserver
                      </button>
                    </td>
                  </tr>

                  {/* Salle Cours */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-gray-900 block">Salle Cours</span>
                      <span className="text-gray-500">Capacité : 15 personnes</span>
                    </td>
                    <td className="p-4 font-bold text-[#064E3B]">1 200 DA</td>
                    <td className="p-4 font-bold text-gray-900">2 500 DA</td>
                    <td className="p-4 font-bold text-gray-900">4 500 DA</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectRoomBooking('2')}
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold"
                      >
                        Réserver
                      </button>
                    </td>
                  </tr>

                  {/* Salle Conférence */}
                  <tr className="hover:bg-gray-50 bg-amber-50/20">
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-gray-900 block">Salle Conférence</span>
                      <span className="text-gray-500">Capacité : 30 personnes</span>
                    </td>
                    <td className="p-4 font-bold text-gray-400 italic">Non disponible</td>
                    <td className="p-4 font-bold text-gray-900">6 000 DA</td>
                    <td className="p-4 font-black text-[#064E3B]">11 000 DA</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectRoomBooking('3')}
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold"
                      >
                        Réserver
                      </button>
                    </td>
                  </tr>

                  {/* Salle Visioconférence */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-gray-900 block">Salle Visioconférence</span>
                      <span className="text-gray-500">Capacité : 10 personnes</span>
                    </td>
                    <td className="p-4 font-bold text-[#064E3B]">1 800 DA</td>
                    <td className="p-4 font-bold text-gray-900">6 500 DA</td>
                    <td className="p-4 font-bold text-gray-900">13 500 DA</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectRoomBooking('4')}
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold"
                      >
                        Réserver
                      </button>
                    </td>
                  </tr>

                  {/* Studio Photo / Vidéo */}
                  <tr className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-extrabold text-sm text-gray-900 block">Studio Photo / Vidéo</span>
                      <span className="text-gray-500">Équipé création de contenu</span>
                    </td>
                    <td className="p-4 font-bold text-[#064E3B]">3 000 DA</td>
                    <td className="p-4 font-bold text-gray-900">10 000 DA</td>
                    <td className="p-4 font-bold text-gray-900">18 000 DA</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectRoomBooking('5')}
                        className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold"
                      >
                        Réserver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: OFFRES ENTREPRISES & PME */}
      {activeSection === 'pme' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              Bureaux & Postes Clé en Main
            </span>
            <h3 className="text-2xl font-black text-[#064E3B]">
              OFFRES ENTREPRISES & PME (BLIDA)
            </h3>
            <p className="text-xs text-gray-500">
              Idéal pour les structures cherchant un cadre hautement professionnel, moderne et flexible au centre de Blida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFRES_PME.map((offre) => (
              <div
                key={offre.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 hover:border-[#064E3B] transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                      <Briefcase className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-bold text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded-full">
                      Clé en main
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-gray-900">{offre.nom}</h4>
                    <p className="text-xs font-bold text-emerald-800 mt-1">{offre.postes}</p>
                  </div>

                  <div className="py-3 border-y border-gray-100">
                    <span className="text-2xl font-black text-[#064E3B]">{offre.prixMensuelHT}</span>
                    <span className="text-[11px] text-gray-500 block">/ mois HT</span>
                  </div>

                  <ul className="text-xs text-gray-600 space-y-2.5">
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Connexion :</strong> {offre.connexion}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Boissons :</strong> {offre.boissons}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Impressions :</strong> {offre.impressions}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Salle de réunion :</strong> {offre.salleReunion}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Légal :</strong> {offre.domiciliation}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Horaires :</strong> {offre.horaires}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Support :</strong> {offre.support}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPackBooking('PME Clé en Main')}
                  className="mt-6 w-full py-3 rounded-xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Demander cette offre
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: DOMICILIATION SEULE */}
      {activeSection === 'domiciliation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F59E0B] inline-flex items-center justify-center font-bold mb-2">
              <BadgeCheck className="w-6 h-6" />
            </span>
            <h3 className="text-2xl font-black text-[#064E3B]">
              {OFFRE_DOMICILIATION.titre}
            </h3>
            <p className="text-xs text-gray-600 max-w-lg mx-auto">
              {OFFRE_DOMICILIATION.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Adresse commerciale & Boîte postale
              </span>
              <span className="text-2xl font-black text-[#064E3B]">
                {OFFRE_DOMICILIATION.tarifAdresse}
              </span>
              <p className="text-xs text-gray-600">
                Domiciliation juridique de votre siège à Blida avec réception du courrier et réexpédition.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Service fiscalité & assurance
              </span>
              <span className="text-2xl font-black text-[#F59E0B]">
                Sur devis
              </span>
              <p className="text-xs text-gray-600">
                Accompagnement administratif, comptable et couverture assurance selon vos besoins précis.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => onSelectPackBooking('Domiciliation')}
              className="px-8 py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#043d2e] text-white font-black text-xs shadow-md transition-transform active:scale-95"
            >
              Souscrire à la domiciliation INNID
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
