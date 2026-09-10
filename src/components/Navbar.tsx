import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Plus,
  ShieldCheck,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Sliders,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Instagram,
  Mail,
} from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenNewReservation: () => void;
  onOpenDirectBookingModal?: () => void;
  userSession: UserSession;
  setUserSession: React.Dispatch<React.SetStateAction<UserSession>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedDate,
  setSelectedDate,
  onOpenNewReservation,
  onOpenDirectBookingModal,
  userSession,
  setUserSession,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Date manipulation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    setSelectedDate('2026-09-08'); // Date de référence INNID
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner with Brand Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo INNID */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#064E3B] flex items-center justify-center text-white shadow-md font-black text-xl tracking-wider">
              <span className="text-[#F59E0B]">I</span>N
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl text-[#064E3B] tracking-tight">
                  INNID <span className="text-[#F59E0B] font-semibold">BOOKING</span>
                </span>
                <span className="bg-emerald-100 text-[#064E3B] text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                  V1 Pro
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Gestion intelligente des salles & espaces INNID
              </p>
            </div>
          </div>

          {/* Date Picker Bar */}
          <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            <button
              id="btn-prev-day"
              onClick={handlePrevDay}
              className="p-1.5 text-gray-600 hover:text-[#064E3B] hover:bg-white rounded-lg transition-colors"
              title="Jour précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="btn-date-display"
              onClick={handleSetToday}
              className="flex items-center space-x-2 px-2.5 py-1 text-sm font-semibold text-[#064E3B] hover:bg-white rounded-lg transition-colors"
              title="Cliquer pour revenir au 08/09/2026"
            >
              <CalendarIcon className="w-4 h-4 text-[#F59E0B]" />
              <span className="capitalize">{formatDateDisplay(selectedDate)}</span>
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="w-7 h-7 opacity-0 absolute cursor-pointer"
              title="Choisir une date"
            />

            <button
              id="btn-next-day"
              onClick={handleNextDay}
              className="p-1.5 text-gray-600 hover:text-[#064E3B] hover:bg-white rounded-lg transition-colors"
              title="Jour suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Button & User profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenDirectBookingModal && (
              <button
                id="btn-nav-direct-channels"
                onClick={onOpenDirectBookingModal}
                className="hidden lg:flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] px-3.5 py-2.5 rounded-xl font-extrabold shadow-2xs hover:shadow-xs transition-all text-xs border border-emerald-300"
                title="Réserver via WhatsApp, Instagram ou Email (inndweb@gmail.com)"
              >
                <div className="flex items-center -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shadow-2xs font-bold">W</span>
                  <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-pink-600 text-white flex items-center justify-center text-[9px] shadow-2xs font-bold">I</span>
                  <span className="w-4 h-4 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[9px] shadow-2xs font-bold">@</span>
                </div>
                <span>WhatsApp • Insta • inndweb</span>
              </button>
            )}

            <button
              id="btn-nav-new-reservation"
              onClick={onOpenNewReservation}
              className="flex items-center space-x-2 bg-[#064E3B] hover:bg-[#043d2e] text-white px-3.5 sm:px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm group"
            >
              <Plus className="w-4 h-4 text-[#F59E0B] group-hover:scale-125 transition-transform" />
              <span>+ Nouvelle réservation</span>
            </button>

            {/* Role switch / Auth button */}
            <button
              id="btn-auth-profile"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
            >
              {userSession.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                  <span className="hidden md:inline text-[#064E3B] font-bold">ADMIN INNID</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-[#F59E0B]" />
                  <span className="hidden md:inline">Accueil / Réception</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-gray-100">
          <button
            id="tab-dashboard"
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Dashboard INNID</span>
          </button>

          <button
            id="tab-planning"
            onClick={() => setCurrentTab('planning')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'planning'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className={`w-4 h-4 ${currentTab === 'planning' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Planning visuel</span>
          </button>

          <button
            id="tab-today"
            onClick={() => setCurrentTab('today')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'today'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Clock className={`w-4 h-4 ${currentTab === 'today' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Vue Aujourd'hui</span>
            <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              5s
            </span>
          </button>

          <button
            id="tab-coworking"
            onClick={() => setCurrentTab('coworking')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'coworking'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">🪑</span>
            <span>Coworking (45 chaises)</span>
            <span className="bg-purple-100 text-purple-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              45 pl.
            </span>
          </button>

          <button
            id="tab-pricing"
            onClick={() => setCurrentTab('pricing')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'pricing'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span className="text-sm">🏷️</span>
            <span>Tarifs & Packs INNID</span>
          </button>

          <button
            id="tab-statistiques"
            onClick={() => setCurrentTab('statistiques')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'statistiques'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${currentTab === 'statistiques' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Statistiques & CA</span>
            <span className="bg-emerald-100 text-[#064E3B] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              Recharts
            </span>
          </button>

          <button
            id="tab-reservations"
            onClick={() => setCurrentTab('reservations')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'reservations'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Search className={`w-4 h-4 ${currentTab === 'reservations' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Recherche & Réservations</span>
          </button>

          <button
            id="tab-salles"
            onClick={() => setCurrentTab('salles')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'salles'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Building2 className={`w-4 h-4 ${currentTab === 'salles' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Gestion Salles</span>
          </button>

          <button
            id="tab-admin"
            onClick={() => setCurrentTab('admin')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'admin'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Sliders className={`w-4 h-4 ${currentTab === 'admin' ? 'text-[#F59E0B]' : 'text-gray-500'}`} />
            <span>Administration & Déploiement</span>
          </button>
        </nav>
      </div>

      {/* Profile / Auth Switch Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#064E3B] flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
                <span>Profil & Rôle INNID</span>
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Basculez entre le mode Réception (prise de réservation express) et le mode Administrateur (configuration complète des salles et sécurité).
            </p>

            <div className="space-y-3 mb-6">
              <div
                onClick={() => {
                  setUserSession({ role: 'admin', name: 'Admin Principal', email: 'admin@innid.com', isAuthenticated: true });
                  setShowAuthModal(false);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  userSession.role === 'admin'
                    ? 'border-[#064E3B] bg-emerald-50/60'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#064E3B] text-[#F59E0B] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">ADMIN INNID</h4>
                    <p className="text-xs text-gray-500">Accès total : gestion salles, sécurité, export base</p>
                  </div>
                </div>
                {userSession.role === 'admin' && <CheckCircle2 className="w-5 h-5 text-[#064E3B]" />}
              </div>

              <div
                onClick={() => {
                  setUserSession({ role: 'reception', name: 'Réceptionniste', email: 'reception@innid.com', isAuthenticated: true });
                  setShowAuthModal(false);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  userSession.role === 'reception'
                    ? 'border-[#F59E0B] bg-amber-50/60'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <User className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Personnel Accueil / Réception</h4>
                    <p className="text-xs text-gray-500">Prise de réservation, planning jour, check-in client</p>
                  </div>
                </div>
                {userSession.role === 'reception' && <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" />}
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
