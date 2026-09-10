import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Building2,
  Clock,
  Plus,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { VisualCalendarView } from './components/VisualCalendarView';
import { TodayQuickView } from './components/TodayQuickView';
import { ReservationsListView } from './components/ReservationsListView';
import { RoomsManagementView } from './components/RoomsManagementView';
import { CoworkingSeatsView } from './components/CoworkingSeatsView';
import { PricingPacksView } from './components/PricingPacksView';
import { StatsDashboardView } from './components/StatsDashboardView';
import { AdminDeployModal } from './components/AdminDeployModal';
import { ReservationModal } from './components/ReservationModal';
import { ReservationDetailModal } from './components/ReservationDetailModal';

import { Salle, Reservation, UserSession, TypeReservation } from './types';
import {
  getSalles,
  getReservations,
  annulerReservation,
  supprimerReservation,
  verifierConflitReservation,
} from './services/storage';

export default function App() {
  // App state
  const [salles, setSalles] = useState<Salle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-08');

  // User session
  const [userSession, setUserSession] = useState<UserSession>({
    role: 'admin',
    name: 'ADMIN INNID',
    email: 'admin@innid.com',
    isAuthenticated: true,
  });

  // Modals state
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [prefillSalleId, setPrefillSalleId] = useState<string | undefined>(undefined);
  const [prefillHeure, setPrefillHeure] = useState<string | undefined>(undefined);
  const [prefillChaises, setPrefillChaises] = useState<number[] | undefined>(undefined);
  const [prefillType, setPrefillType] = useState<TypeReservation | undefined>(undefined);
  const [prefillNbPersonnes, setPrefillNbPersonnes] = useState<number | undefined>(undefined);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedReservationForDetail, setSelectedReservationForDetail] = useState<Reservation | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial load
  const loadData = () => {
    setSalles(getSalles());
    setReservations(getReservations());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleOpenNewReservation = (
    roomPrefillId?: string,
    timePrefill?: string,
    chaises?: number[],
    typePrefill?: TypeReservation,
    nbPersonnes?: number
  ) => {
    setEditingReservation(null);
    setPrefillSalleId(roomPrefillId);
    setPrefillHeure(timePrefill);
    setPrefillChaises(chaises);
    setPrefillType(typePrefill);
    setPrefillNbPersonnes(nbPersonnes);
    setIsReservationModalOpen(true);
  };

  const handleOpenReservationWithSeats = (chaises: number[], startTime: string, endTime: string) => {
    const coworkingRoom = salles.find((s) => s.categorie === 'coworking' || s.total_chaises === 45);
    const cId = coworkingRoom?.id || '7';
    let pType: TypeReservation = 'Pack Solo/Étudiant';
    if (chaises.length >= 6) {
      pType = 'Pack Pro';
    } else if (chaises.length >= 3) {
      pType = 'Pack Start-up';
    }

    handleOpenNewReservation(cId, startTime, chaises, pType, chaises.length);
  };

  const handleSelectPackBooking = (packType: string, nombrePersonnes: number = 1, salleId?: string) => {
    const coworkingRoom = salles.find((s) => s.categorie === 'coworking' || s.total_chaises === 45);
    const targetRoomId = salleId || (coworkingRoom?.id || '7');

    let initialChairs: number[] = [];
    if (targetRoomId === coworkingRoom?.id) {
      initialChairs = Array.from({ length: Math.min(nombrePersonnes, 45) }, (_, i) => i + 1);
    }

    handleOpenNewReservation(
      targetRoomId,
      '09:00',
      initialChairs.length > 0 ? initialChairs : undefined,
      packType as TypeReservation,
      nombrePersonnes
    );
  };

  const handleSelectRoomBooking = (salleId: string) => {
    handleOpenNewReservation(salleId, '09:00', undefined, 'Réunion');
  };

  const handleEditReservation = (res: Reservation) => {
    setEditingReservation(res);
    setPrefillSalleId(res.salle_id);
    setPrefillHeure(res.heure_debut);
    setPrefillChaises(res.chaises_reservees);
    setPrefillType(res.type);
    setPrefillNbPersonnes(res.nombre_personnes);
    setIsReservationModalOpen(true);
  };

  const handleReservationSuccess = (res: Reservation) => {
    loadData();
    showToast(`Réservation enregistrée avec succès pour ${res.client_nom} (${res.formule_tarifaire || ''}) !`, 'success');
  };

  const handleCancelReservation = (id: string) => {
    annulerReservation(id);
    loadData();
    showToast('Réservation marquée comme annulée.', 'warning');
  };

  const handleDeleteReservation = (id: string) => {
    supprimerReservation(id);
    loadData();
    showToast('Réservation supprimée définitivement.', 'warning');
  };

  // Quick Conflict Test Demo
  const handleTestConflictDemo = () => {
    setSelectedDate('2026-09-08');
    setEditingReservation(null);
    setPrefillSalleId('3'); // Conférence
    setPrefillHeure('11:00');
    setIsReservationModalOpen(true);
  };

  const coworkingRoom = salles.find((s) => s.categorie === 'coworking' || s.total_chaises === 45);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col font-sans selection:bg-[#F59E0B] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenNewReservation={() => handleOpenNewReservation()}
        userSession={userSession}
        setUserSession={setUserSession}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick helper banner: anti-conflict tester & 45 chairs announcement */}
        <div className="mb-6 bg-gradient-to-r from-emerald-950 via-[#064E3B] to-emerald-900 text-white p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <span className="p-2 rounded-xl bg-[#F59E0B] text-white font-black text-sm shrink-0">
              🛡️
            </span>
            <div>
              <span className="font-extrabold text-white">INNID Blida • Sécurité Anti-conflit & 45 Chaises Coworking :</span>{' '}
              <span className="text-emerald-200">
                Double contrôle instantané (salles complètes & postes de travail 1 à 45) avec tarifs officiels en DA.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setCurrentTab('coworking')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl transition-all border border-white/20"
            >
              Voir les 45 chaises
            </button>
            <button
              onClick={handleTestConflictDemo}
              className="bg-[#F59E0B] hover:bg-[#d98206] text-white font-black px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center space-x-1"
            >
              <span>Tester anti-conflit</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Dashboard */}
        {currentTab === 'dashboard' && (
          <DashboardView
            salles={salles}
            reservations={reservations}
            selectedDate={selectedDate}
            onOpenNewReservation={handleOpenNewReservation}
            onGoToPlanning={() => setCurrentTab('planning')}
            onGoToToday={() => setCurrentTab('today')}
            onSelectReservation={(res) => setSelectedReservationForDetail(res)}
          />
        )}

        {/* Tab 2: Planning Visuel */}
        {currentTab === 'planning' && (
          <VisualCalendarView
            salles={salles}
            reservations={reservations}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenNewReservation={handleOpenNewReservation}
            onSelectReservation={(res) => setSelectedReservationForDetail(res)}
          />
        )}

        {/* Tab 3: Vue Aujourd'hui (5 secondes) */}
        {currentTab === 'today' && (
          <TodayQuickView
            salles={salles}
            reservations={reservations}
            selectedDate={selectedDate}
            onOpenNewReservation={() => handleOpenNewReservation()}
            onSelectReservation={(res) => setSelectedReservationForDetail(res)}
          />
        )}

        {/* Tab: Plan Coworking (45 Chaises) */}
        {currentTab === 'coworking' && (
          <CoworkingSeatsView
            coworkingSalle={coworkingRoom}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenReservationWithSeats={handleOpenReservationWithSeats}
            onSelectReservation={(res) => setSelectedReservationForDetail(res)}
          />
        )}

        {/* Tab: Grille Tarifaire & Packs INNID */}
        {currentTab === 'pricing' && (
          <PricingPacksView
            salles={salles}
            onSelectPackBooking={handleSelectPackBooking}
            onSelectRoomBooking={handleSelectRoomBooking}
          />
        )}

        {/* Tab: Statistiques & Chiffre d'Affaires (Recharts) */}
        {currentTab === 'statistiques' && (
          <StatsDashboardView
            salles={salles}
            reservations={reservations}
            selectedDate={selectedDate}
            onOpenNewReservation={() => handleOpenNewReservation()}
          />
        )}

        {/* Tab 4: Recherche & Réservations */}
        {currentTab === 'reservations' && (
          <ReservationsListView
            salles={salles}
            reservations={reservations}
            onOpenNewReservation={() => handleOpenNewReservation()}
            onSelectReservation={(res) => setSelectedReservationForDetail(res)}
            onEditReservation={handleEditReservation}
            onCancelReservation={handleCancelReservation}
            onDeleteReservation={handleDeleteReservation}
          />
        )}

        {/* Tab 5: Salles */}
        {currentTab === 'salles' && (
          <RoomsManagementView
            salles={salles}
            onRefreshSalles={loadData}
            isAdmin={userSession.role === 'admin'}
          />
        )}

        {/* Tab 6: Administration & Déploiement */}
        {currentTab === 'admin' && (
          <AdminDeployModal
            userSession={userSession}
            setUserSession={setUserSession}
            onDataReset={loadData}
          />
        )}
      </main>

      {/* Reservation Form Modal */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => {
          setIsReservationModalOpen(false);
          setEditingReservation(null);
          setPrefillChaises(undefined);
          setPrefillType(undefined);
          setPrefillNbPersonnes(undefined);
        }}
        onSuccess={handleReservationSuccess}
        salles={salles}
        selectedDate={selectedDate}
        initialReservation={editingReservation}
        prefillSalleId={prefillSalleId}
        prefillHeure={prefillHeure}
        prefillChaises={prefillChaises}
        prefillType={prefillType}
        prefillNbPersonnes={prefillNbPersonnes}
      />

      {/* Reservation Detail Modal */}
      <ReservationDetailModal
        reservation={selectedReservationForDetail}
        salles={salles}
        onClose={() => setSelectedReservationForDetail(null)}
        onEdit={(res) => {
          setSelectedReservationForDetail(null);
          handleEditReservation(res);
        }}
        onCancel={handleCancelReservation}
        onDelete={handleDeleteReservation}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-[#064E3B] text-white border border-emerald-600'
                : toastMessage.type === 'warning'
                ? 'bg-[#F59E0B] text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#064E3B]">INNID BOOKING V1</span>
            <span>• Plateforme de gestion des réservations & 45 chaises Coworking</span>
          </div>
          <p>Design aux couleurs INNID (#064E3B, #F59E0B) • Blida • Protection anti-chevauchement serveur</p>
        </div>
      </footer>
    </div>
  );
}
