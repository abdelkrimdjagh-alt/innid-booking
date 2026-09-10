import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  Clock,
  Building2,
  Users,
  Sparkles,
  ArrowUpRight,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Hash,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Salle, Reservation } from '../types';

export type PeriodeType = 'cette_semaine' | 'ce_mois' | 'trimestre' | 'annee';
export type TrimestreType = 'T1' | 'T2' | 'T3' | 'T4';
export type ActiveStatsSubTab = 'synthese' | 'chaises';

interface StatsDashboardViewProps {
  salles: Salle[];
  reservations: Reservation[];
  selectedDate?: string;
  onOpenNewReservation?: () => void;
}

const MONTH_NAMES = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];

const COLORS_PALETTE = [
  '#064E3B', // Vert Foncé INNID
  '#F59E0B', // Ambre INNID
  '#10B981', // Émeraude
  '#3B82F6', // Bleu
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#0D9488', // Teal
];

export const StatsDashboardView: React.FC<StatsDashboardViewProps> = ({
  salles,
  reservations,
  selectedDate = '2026-09-08',
}) => {
  // Filtres de période demandés par l'utilisateur
  const [periode, setPeriode] = useState<PeriodeType>('ce_mois');
  const [trimestre, setTrimestre] = useState<TrimestreType>('T3');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  // Filtres d'espace et de chaise
  const [selectedSalleFilter, setSelectedSalleFilter] = useState<string>('all');
  const [selectedChaiseNum, setSelectedChaiseNum] = useState<string>('all'); // 'all' ou '1' à '45'

  // Onglet interne dans la vue statistiques
  const [activeSubTab, setActiveSubTab] = useState<ActiveStatsSubTab>('synthese');

  // Chaise sélectionnée pour détail modal/popover
  const [inspectingChairNum, setInspectingChairNum] = useState<number | null>(null);

  // Filtre statut chaises dans la heatmap
  const [chairStatusFilter, setChairStatusFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Identifiant de la salle coworking
  const coworkingRoom = useMemo(() => {
    return salles.find((s) => s.categorie === 'coworking' || s.total_chaises === 45) || salles.find((s) => s.id === '7');
  }, [salles]);

  const coworkingId = coworkingRoom?.id || '7';

  // Calcul des bornes de dates pour la semaine (Lundi à Dimanche autour de la date sélectionnée)
  const semaineDates = useMemo(() => {
    try {
      const parts = selectedDate.split('-').map(Number);
      const cur = new Date(parts[0], parts[1] - 1, parts[2]);
      const day = cur.getDay(); // 0 = Dimanche, 1 = Lundi, ...
      const diffToMonday = day === 0 ? -6 : 1 - day; // Lundi = 1
      const monday = new Date(cur);
      monday.setDate(cur.getDate() + diffToMonday);

      const days: { dateStr: string; label: string; shortLabel: string }[] = [];
      const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${dayNum}`;
        days.push({
          dateStr,
          label: `${dayLabels[i]} ${dayNum}/${m}`,
          shortLabel: dayLabels[i],
        });
      }
      return days;
    } catch {
      return [
        { dateStr: '2026-09-07', label: 'Lun 07/09', shortLabel: 'Lun' },
        { dateStr: '2026-09-08', label: 'Mar 08/09', shortLabel: 'Mar' },
        { dateStr: '2026-09-09', label: 'Mer 09/09', shortLabel: 'Mer' },
        { dateStr: '2026-09-10', label: 'Jeu 10/09', shortLabel: 'Jeu' },
        { dateStr: '2026-09-11', label: 'Ven 11/09', shortLabel: 'Ven' },
        { dateStr: '2026-09-12', label: 'Sam 12/09', shortLabel: 'Sam' },
        { dateStr: '2026-09-13', label: 'Dim 13/09', shortLabel: 'Dim' },
      ];
    }
  }, [selectedDate]);

  // Mois courant sélectionné (ex: 2026-09)
  const currentMonthKey = useMemo(() => {
    return selectedDate.slice(0, 7) || `${selectedYear}-09`;
  }, [selectedDate, selectedYear]);

  // Mois inclus dans le trimestre sélectionné
  const trimestreMoisIndexes = useMemo(() => {
    switch (trimestre) {
      case 'T1':
        return [0, 1, 2]; // Jan, Fév, Mar
      case 'T2':
        return [3, 4, 5]; // Avr, Mai, Juin
      case 'T3':
        return [6, 7, 8]; // Juil, Août, Sep
      case 'T4':
        return [9, 10, 11]; // Oct, Nov, Déc
    }
  }, [trimestre]);

  // Label descriptif de la période courante
  const periodeLabel = useMemo(() => {
    if (periode === 'cette_semaine') {
      const first = semaineDates[0];
      const last = semaineDates[6];
      return `Semaine du ${first?.label} au ${last?.label} ${selectedYear}`;
    }
    if (periode === 'ce_mois') {
      const monthNum = parseInt(currentMonthKey.split('-')[1], 10) - 1;
      return `${MONTH_NAMES[monthNum] || 'Septembre'} ${selectedYear}`;
    }
    if (periode === 'trimestre') {
      const tLabels = {
        T1: 'Trimestre 1 (Janvier - Mars)',
        T2: 'Trimestre 2 (Avril - Juin)',
        T3: 'Trimestre 3 (Juillet - Septembre)',
        T4: 'Trimestre 4 (Octobre - Décembre)',
      };
      return `${tLabels[trimestre]} ${selectedYear}`;
    }
    return `Année ${selectedYear} (12 Mois)`;
  }, [periode, semaineDates, currentMonthKey, trimestre, selectedYear]);

  // 1. Filtrage des réservations selon la période et les filtres (Salle / Chaise)
  const activeReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (r.statut === 'Annulée') return false;
      if (!r.date) return false;

      // Filtre d'année
      if (!r.date.startsWith(selectedYear)) return false;

      // Filtre de salle
      if (selectedSalleFilter !== 'all' && r.salle_id !== selectedSalleFilter) return false;

      // Filtre de chaise spécifique
      if (selectedChaiseNum !== 'all') {
        const chairInt = parseInt(selectedChaiseNum, 10);
        if (r.salle_id !== coworkingId) return false;
        if (!r.chaises_reservees || !r.chaises_reservees.includes(chairInt)) return false;
      }

      // Filtre selon la période
      if (periode === 'cette_semaine') {
        const matchDay = semaineDates.some((d) => d.dateStr === r.date);
        if (!matchDay) return false;
      } else if (periode === 'ce_mois') {
        if (!r.date.startsWith(currentMonthKey)) return false;
      } else if (periode === 'trimestre') {
        const mIndex = parseInt(r.date.split('-')[1], 10) - 1;
        if (!trimestreMoisIndexes.includes(mIndex)) return false;
      }
      // 'annee' : garde toutes les dates de l'année sélectionnée

      return true;
    });
  }, [
    reservations,
    selectedYear,
    selectedSalleFilter,
    selectedChaiseNum,
    coworkingId,
    periode,
    semaineDates,
    currentMonthKey,
    trimestreMoisIndexes,
  ]);

  // 2. Calcul des Données Granulaires pour Recharts selon la période sélectionnée
  const granularChartData = useMemo(() => {
    // Calcul de la capacité théorique d'heures
    const isCoworkingOnly = selectedSalleFilter === coworkingId;
    const isSingleChair = selectedChaiseNum !== 'all';
    const activeRoomsCount = selectedSalleFilter === 'all'
      ? Math.max(1, salles.filter((s) => s.statut === 'Active').length)
      : 1;

    // A) CETTE SEMAINE : Granularité 7 Jours
    if (periode === 'cette_semaine') {
      return semaineDates.map((dayObj) => {
        const dayReservations = activeReservations.filter((r) => r.date === dayObj.dateStr);

        let heures = 0;
        let ca = 0;

        dayReservations.forEach((r) => {
          const [h1, m1] = r.heure_debut.split(':').map(Number);
          const [h2, m2] = r.heure_fin.split(':').map(Number);
          const duration = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);

          if (isSingleChair) {
            heures += duration;
            const nbChaises = r.chaises_reservees?.length || 1;
            ca += (r.montant_total || (duration * 1500)) / nbChaises;
          } else {
            heures += duration;
            ca += r.montant_total || (duration * 1500);
          }
        });

        // Capacité quotidienne : 11h ouvrables (8h-20h)
        const dailyCapHours = isSingleChair
          ? 11
          : isCoworkingOnly
          ? 11 * 45 // 45 chaises
          : 11 * activeRoomsCount;

        const rate = dailyCapHours > 0 ? (heures / dailyCapHours) * 100 : 0;

        return {
          key: dayObj.dateStr,
          name: dayObj.label,
          shortName: dayObj.shortLabel,
          reservationsCount: dayReservations.length,
          heuresReservees: Math.round(heures * 10) / 10,
          chiffreAffaires: Math.round(ca),
          tauxOccupation: Math.min(100, Math.round(rate * 10) / 10),
          capaciteHeures: dailyCapHours,
        };
      });
    }

    // B) CE MOIS : Granularité 4 Semaines
    if (periode === 'ce_mois') {
      const weeks = [
        { key: 'S1', name: 'Semaine 1 (01-07)', daysRange: [1, 7], daysCount: 7 },
        { key: 'S2', name: 'Semaine 2 (08-14)', daysRange: [8, 14], daysCount: 7 },
        { key: 'S3', name: 'Semaine 3 (15-21)', daysRange: [15, 21], daysCount: 7 },
        { key: 'S4', name: 'Semaine 4 (22-30)', daysRange: [22, 31], daysCount: 9 },
      ];

      return weeks.map((w) => {
        const weekReservations = activeReservations.filter((r) => {
          if (!r.date) return false;
          const day = parseInt(r.date.split('-')[2], 10);
          return day >= w.daysRange[0] && day <= w.daysRange[1];
        });

        let heures = 0;
        let ca = 0;

        weekReservations.forEach((r) => {
          const [h1, m1] = r.heure_debut.split(':').map(Number);
          const [h2, m2] = r.heure_fin.split(':').map(Number);
          const duration = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);

          if (isSingleChair) {
            heures += duration;
            const nbChaises = r.chaises_reservees?.length || 1;
            ca += (r.montant_total || (duration * 1500)) / nbChaises;
          } else {
            heures += duration;
            ca += r.montant_total || (duration * 1500);
          }
        });

        const weekCapHours = isSingleChair
          ? 11 * w.daysCount
          : isCoworkingOnly
          ? 11 * 45 * w.daysCount
          : 11 * activeRoomsCount * w.daysCount;

        const rate = weekCapHours > 0 ? (heures / weekCapHours) * 100 : 0;

        return {
          key: w.key,
          name: w.name,
          shortName: w.key,
          reservationsCount: weekReservations.length,
          heuresReservees: Math.round(heures * 10) / 10,
          chiffreAffaires: Math.round(ca),
          tauxOccupation: Math.min(100, Math.round(rate * 10) / 10),
          capaciteHeures: weekCapHours,
        };
      });
    }

    // C) TRIMESTRE : Granularité 3 Mois du Trimestre
    if (periode === 'trimestre') {
      return trimestreMoisIndexes.map((mIndex) => {
        const mKey = `${selectedYear}-${String(mIndex + 1).padStart(2, '0')}`;
        const monthReservations = activeReservations.filter((r) => r.date?.startsWith(mKey));

        let heures = 0;
        let ca = 0;

        monthReservations.forEach((r) => {
          const [h1, m1] = r.heure_debut.split(':').map(Number);
          const [h2, m2] = r.heure_fin.split(':').map(Number);
          const duration = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);

          if (isSingleChair) {
            heures += duration;
            const nbChaises = r.chaises_reservees?.length || 1;
            ca += (r.montant_total || (duration * 1500)) / nbChaises;
          } else {
            heures += duration;
            ca += r.montant_total || (duration * 1500);
          }
        });

        const monthCapHours = isSingleChair
          ? 25 * 11
          : isCoworkingOnly
          ? 25 * 11 * 45
          : 25 * 11 * activeRoomsCount;

        const rate = monthCapHours > 0 ? (heures / monthCapHours) * 100 : 0;

        return {
          key: mKey,
          name: MONTH_NAMES[mIndex],
          shortName: MONTH_NAMES[mIndex],
          reservationsCount: monthReservations.length,
          heuresReservees: Math.round(heures * 10) / 10,
          chiffreAffaires: Math.round(ca),
          tauxOccupation: Math.min(100, Math.round(rate * 10) / 10),
          capaciteHeures: monthCapHours,
        };
      });
    }

    // D) ANNÉE : Granularité 12 Mois
    return Array.from({ length: 12 }, (_, i) => {
      const mKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
      const monthReservations = activeReservations.filter((r) => r.date?.startsWith(mKey));

      let heures = 0;
      let ca = 0;

      monthReservations.forEach((r) => {
        const [h1, m1] = r.heure_debut.split(':').map(Number);
        const [h2, m2] = r.heure_fin.split(':').map(Number);
        const duration = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);

        if (isSingleChair) {
          heures += duration;
          const nbChaises = r.chaises_reservees?.length || 1;
          ca += (r.montant_total || (duration * 1500)) / nbChaises;
        } else {
          heures += duration;
          ca += r.montant_total || (duration * 1500);
        }
      });

      const monthCapHours = isSingleChair
        ? 25 * 11
        : isCoworkingOnly
        ? 25 * 11 * 45
        : 25 * 11 * activeRoomsCount;

      const rate = monthCapHours > 0 ? (heures / monthCapHours) * 100 : 0;

      return {
        key: mKey,
        name: MONTH_NAMES[i],
        shortName: MONTH_NAMES[i],
        reservationsCount: monthReservations.length,
        heuresReservees: Math.round(heures * 10) / 10,
        chiffreAffaires: Math.round(ca),
        tauxOccupation: Math.min(100, Math.round(rate * 10) / 10),
        capaciteHeures: monthCapHours,
      };
    });
  }, [
    periode,
    semaineDates,
    activeReservations,
    selectedSalleFilter,
    selectedChaiseNum,
    coworkingId,
    salles,
    trimestreMoisIndexes,
    selectedYear,
  ]);

  // 3. Répartition du Chiffre d'Affaires par Salle / Espace
  const revenueByRoomData = useMemo(() => {
    const roomMap: Record<string, { nom: string; ca: number; reservationsCount: number }> = {};

    salles.forEach((s) => {
      roomMap[s.id] = { nom: s.nom, ca: 0, reservationsCount: 0 };
    });

    activeReservations.forEach((r) => {
      if (roomMap[r.salle_id]) {
        const [h1, m1] = r.heure_debut.split(':').map(Number);
        const [h2, m2] = r.heure_fin.split(':').map(Number);
        const duration = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
        const ca = r.montant_total || duration * 1500;

        roomMap[r.salle_id].ca += ca;
        roomMap[r.salle_id].reservationsCount += 1;
      }
    });

    return Object.entries(roomMap)
      .map(([id, val], index) => ({
        id,
        nom: val.nom,
        value: val.ca,
        reservationsCount: val.reservationsCount,
        color: COLORS_PALETTE[index % COLORS_PALETTE.length],
      }))
      .filter((item) => item.value > 0 || selectedSalleFilter === 'all')
      .sort((a, b) => b.value - a.value);
  }, [salles, activeReservations, selectedSalleFilter]);

  // 4. STATISTIQUES DES 45 CHAISES COWORKING (AVEC LEUR NUMÉRO 1 À 45)
  const chaisesStatsData = useMemo(() => {
    // Calcul de la capacité théorique d'une chaise selon la période
    let maxHoursPerChair = 77; // par défaut 7 jours * 11h = 77h pour semaine
    if (periode === 'cette_semaine') maxHoursPerChair = 7 * 11;
    else if (periode === 'ce_mois') maxHoursPerChair = 25 * 11; // 275h
    else if (periode === 'trimestre') maxHoursPerChair = 75 * 11; // 825h
    else if (periode === 'annee') maxHoursPerChair = 300 * 11; // 3300h

    // Récupérer toutes les réservations coworking actives pour la période
    const coworkingResOnPeriod = reservations.filter((r) => {
      if (r.statut === 'Annulée') return false;
      if (r.salle_id !== coworkingId) return false;
      if (!r.date || !r.date.startsWith(selectedYear)) return false;

      if (periode === 'cette_semaine') {
        return semaineDates.some((d) => d.dateStr === r.date);
      } else if (periode === 'ce_mois') {
        return r.date.startsWith(currentMonthKey);
      } else if (periode === 'trimestre') {
        const m = parseInt(r.date.split('-')[1], 10) - 1;
        return trimestreMoisIndexes.includes(m);
      }
      return true;
    });

    // Calcul pour chacune des 45 chaises
    const chairs = Array.from({ length: 45 }, (_, idx) => {
      const num = idx + 1;
      let count = 0;
      let heures = 0;
      let ca = 0;
      const matchingRes: Reservation[] = [];

      coworkingResOnPeriod.forEach((r) => {
        let isChairBooked = false;
        if (r.chaises_reservees && r.chaises_reservees.length > 0) {
          isChairBooked = r.chaises_reservees.includes(num);
        } else if (r.nombre_personnes) {
          // Si les chaises précises ne sont pas listées mais 45 max
          isChairBooked = num <= r.nombre_personnes;
        }

        if (isChairBooked) {
          matchingRes.push(r);
          count += 1;
          const [h1, m1] = r.heure_debut.split(':').map(Number);
          const [h2, m2] = r.heure_fin.split(':').map(Number);
          const duration = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
          heures += duration;

          const totalChairsInRes = r.chaises_reservees?.length || r.nombre_personnes || 1;
          const revenueShare = (r.montant_total || duration * 300) / totalChairsInRes;
          ca += revenueShare;
        }
      });

      const taux = maxHoursPerChair > 0 ? (heures / maxHoursPerChair) * 100 : 0;
      const tauxArrondi = Math.min(100, Math.round(taux * 10) / 10);

      let demandLevel: 'high' | 'medium' | 'low' = 'low';
      if (tauxArrondi >= 40) demandLevel = 'high';
      else if (tauxArrondi >= 15) demandLevel = 'medium';

      return {
        numero: num,
        label: `Chaise n°${String(num).padStart(2, '0')}`,
        shortLabel: `#${num}`,
        reservationsCount: count,
        heuresReservees: Math.round(heures * 10) / 10,
        chiffreAffaires: Math.round(ca),
        tauxOccupation: tauxArrondi,
        demandLevel,
        reservations: matchingRes,
      };
    });

    return chairs;
  }, [
    reservations,
    coworkingId,
    selectedYear,
    periode,
    semaineDates,
    currentMonthKey,
    trimestreMoisIndexes,
  ]);

  // Top 10 des chaises les plus réservées pour le graphique Recharts
  const topChaisesChartData = useMemo(() => {
    return [...chaisesStatsData]
      .sort((a, b) => b.heuresReservees - a.heuresReservees || b.chiffreAffaires - a.chiffreAffaires)
      .slice(0, 10)
      .map((c) => ({
        name: c.label,
        shortName: `#${c.numero}`,
        tauxOccupation: c.tauxOccupation,
        chiffreAffaires: c.chiffreAffaires,
        heures: c.heuresReservees,
        sessions: c.reservationsCount,
      }));
  }, [chaisesStatsData]);

  // Filtrage des chaises pour la Heatmap
  const filteredChaisesForGrid = useMemo(() => {
    if (chairStatusFilter === 'all') return chaisesStatsData;
    return chaisesStatsData.filter((c) => c.demandLevel === chairStatusFilter);
  }, [chaisesStatsData, chairStatusFilter]);

  // Totaux Globaux de la période
  const totalRevenue = useMemo(() => {
    return granularChartData.reduce((acc, m) => acc + m.chiffreAffaires, 0);
  }, [granularChartData]);

  const totalBookedHours = useMemo(() => {
    return granularChartData.reduce((acc, m) => acc + m.heuresReservees, 0);
  }, [granularChartData]);

  const averageOccupancy = useMemo(() => {
    if (granularChartData.length === 0) return 0;
    const sum = granularChartData.reduce((acc, m) => acc + m.tauxOccupation, 0);
    return Math.round((sum / granularChartData.length) * 10) / 10;
  }, [granularChartData]);

  // Chaise la plus performante
  const topChair = useMemo(() => {
    return [...chaisesStatsData].sort((a, b) => b.heuresReservees - a.heuresReservees)[0];
  }, [chaisesStatsData]);

  // Formateur Dinars Algériens (DA)
  const formatDA = (val: number) => {
    return `${Math.round(val).toLocaleString('fr-FR')} DA`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP HEADER BANNER & COMMAND BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-black text-[#F59E0B] uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Statistiques Granulaires INNID Blida</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#064E3B] tracking-tight">
              TABLEAU DE BORD & ANALYSE
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
              Analyse granulaire par période (<span className="font-bold text-gray-700">Semaine, Mois, Trimestre, Année</span>) et suivi individuel des <span className="font-bold text-[#064E3B]">45 chaises numérotées du coworking</span>.
            </p>
          </div>

          {/* SÉLECTEUR DE SOUS-ONGLET STATISTIQUES */}
          <div className="flex items-center space-x-1.5 bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200 self-start lg:self-auto">
            <button
              id="subtab-stats-synthese"
              onClick={() => setActiveSubTab('synthese')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                activeSubTab === 'synthese'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Vue Globale & Salles</span>
            </button>

            <button
              id="subtab-stats-chaises"
              onClick={() => setActiveSubTab('chaises')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                activeSubTab === 'chaises'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Hash className="w-4 h-4 text-[#F59E0B]" />
              <span>Chaises avec Num (1 à 45)</span>
              <span className="bg-[#F59E0B] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                45 Chaises
              </span>
            </button>
          </div>
        </div>

        {/* 2. FILTRES DE PÉRIODE GRANULAIRES (CETTE SEMAINE / CE MOIS / TRIMESTRE / ANNÉE) */}
        <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center space-x-1.5 mr-1">
              <Calendar className="w-4 h-4 text-[#064E3B]" />
              <span>Période :</span>
            </span>

            {/* Bouton Cette Semaine */}
            <button
              id="filter-periode-semaine"
              onClick={() => setPeriode('cette_semaine')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                periode === 'cette_semaine'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>📅 Cette semaine</span>
            </button>

            {/* Bouton Ce Mois */}
            <button
              id="filter-periode-mois"
              onClick={() => setPeriode('ce_mois')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                periode === 'ce_mois'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>🗓️ Ce mois (Sep)</span>
            </button>

            {/* Bouton Trimestre */}
            <button
              id="filter-periode-trimestre"
              onClick={() => setPeriode('trimestre')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                periode === 'trimestre'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>📊 Trimestre</span>
            </button>

            {/* Bouton Année */}
            <button
              id="filter-periode-annee"
              onClick={() => setPeriode('annee')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                periode === 'annee'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>📈 Année 2026</span>
            </button>

            {/* Sous-sélection Trimestres quand Trimestre est actif */}
            {periode === 'trimestre' && (
              <div className="flex items-center space-x-1 bg-amber-50 p-1 rounded-xl border border-amber-200 animate-in fade-in">
                {(['T1', 'T2', 'T3', 'T4'] as TrimestreType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrimestre(t)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-black transition-colors ${
                      trimestre === t
                        ? 'bg-[#F59E0B] text-white shadow-xs'
                        : 'text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTRES ESPACE ET CHAISE */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtre Salle / Espace */}
            <div className="flex items-center space-x-1.5">
              <label className="text-xs font-bold text-gray-500 whitespace-nowrap">
                Espace :
              </label>
              <select
                id="select-salle-filter"
                value={selectedSalleFilter}
                onChange={(e) => {
                  setSelectedSalleFilter(e.target.value);
                  if (e.target.value !== 'all' && e.target.value !== coworkingId) {
                    setSelectedChaiseNum('all');
                  }
                }}
                className="bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold text-[#064E3B] focus:ring-2 focus:ring-[#064E3B] focus:outline-hidden"
              >
                <option value="all">Toutes les salles & coworking</option>
                <option value={coworkingId}>Espace Coworking (45 chaises)</option>
                {salles
                  .filter((s) => s.id !== coworkingId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom} ({s.capacite} p.)
                    </option>
                  ))}
              </select>
            </div>

            {/* Filtre Chaise avec Numéro (1 à 45) */}
            {(selectedSalleFilter === 'all' || selectedSalleFilter === coworkingId) && (
              <div className="flex items-center space-x-1.5">
                <label className="text-xs font-bold text-gray-500 whitespace-nowrap">
                  Chaise n° :
                </label>
                <select
                  id="select-chaise-filter"
                  value={selectedChaiseNum}
                  onChange={(e) => setSelectedChaiseNum(e.target.value)}
                  className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 focus:ring-2 focus:ring-[#F59E0B] focus:outline-hidden"
                >
                  <option value="all">Toutes les 45 chaises</option>
                  {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={String(num)}>
                      Chaise n° {String(num).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Badge informatif de la période active */}
        <div className="flex items-center justify-between bg-emerald-50/70 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs">
          <div className="flex items-center space-x-2 text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-black">Période analysée :</span>
            <span className="font-medium text-emerald-800">{periodeLabel}</span>
            {selectedChaiseNum !== 'all' && (
              <span className="bg-[#F59E0B] text-white px-2 py-0.5 rounded-md font-black text-[11px] ml-2">
                Filtre : Chaise #{selectedChaiseNum} uniquement
              </span>
            )}
          </div>

          <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">
            {activeReservations.length} réservation(s) correspondante(s)
          </span>
        </div>
      </div>

      {/* 3. KPI CARDS GRID (ADAPTÉES À LA PÉRIODE SÉLECTIONNÉE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Chiffre d'Affaires */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Chiffre d'Affaires
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5 text-[#064E3B]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#064E3B]">
            {formatDA(totalRevenue)}
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-semibold flex items-center space-x-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Facturation sur la période</span>
          </p>
        </div>

        {/* Taux d'Occupation Moyen */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Taux d'Occupation
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F59E0B] flex items-center justify-center font-bold">
              <Percent className="w-5 h-5 text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F59E0B]">
            {averageOccupancy}%
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Capacité ouvrable 8h-20h
          </p>
        </div>

        {/* Heures Réservées */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Heures Utilisées
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {Math.round(totalBookedHours)} h
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {activeReservations.length} sessions confirmées
          </p>
        </div>

        {/* Chaise #1 Coworking ou Espace Vedette */}
        <div className="bg-gradient-to-br from-[#064E3B] to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Top Chaise Numérotée
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F59E0B] flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline space-x-2">
            <span>{topChair?.label || 'Chaise #01'}</span>
            <span className="text-xs font-bold text-[#F59E0B]">
              ({topChair?.tauxOccupation || 0}%)
            </span>
          </div>
          <p className="text-xs text-emerald-200 mt-2 font-semibold">
            {topChair?.heuresReservees || 0}h réservées • {formatDA(topChair?.chiffreAffaires || 0)}
          </p>
        </div>
      </div>

      {/* 4. CONTENU PRINCIPAL SELON LE SOUS-ONGLET (SYNTHÈSE GRAPHIQUE VS ANALYSE DES 45 CHAISES) */}

      {activeSubTab === 'synthese' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* GRAPHIQUE 1 : TAUX D'OCCUPATION RECHARTS (ADAPTÉ À LA PÉRIODE) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#064E3B] flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-[#F59E0B]" />
                  <span>
                    Taux d'Occupation (%) •{' '}
                    {periode === 'cette_semaine'
                      ? 'Par Jour (Lun - Dim)'
                      : periode === 'ce_mois'
                      ? 'Par Semaine (S1 - S4)'
                      : periode === 'trimestre'
                      ? 'Par Mois du Trimestre'
                      : 'Par Mois (Année)'}
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  Granularité temporelle adaptée pour {periodeLabel}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Objectif Rentabilité : &gt; 50%</span>
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={granularChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGranularOcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} %`, "Taux d'occupation"]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tauxOccupation"
                    stroke="#064E3B"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGranularOcc)"
                    name="Taux d'occupation (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRAPHIQUE 2 : CHIFFRE D'AFFAIRES RECHARTS (ADAPTÉ À LA PÉRIODE) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#064E3B] flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-[#F59E0B]" />
                  <span>
                    Chiffre d'Affaires Généré (DA) •{' '}
                    {periode === 'cette_semaine'
                      ? 'Par Jour'
                      : periode === 'ce_mois'
                      ? 'Par Semaine'
                      : 'Par Mois'}
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  Total facturé sur la période sélectionnée ({periodeLabel})
                </p>
              </div>

              <span className="text-xs font-black text-[#064E3B] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                Sous-total période : {formatDA(totalRevenue)}
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={granularChartData} margin={{ top: 10, right: 30, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatDA(Number(value)), "Chiffre d'affaires"]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="chiffreAffaires"
                    fill="#064E3B"
                    radius={[8, 8, 0, 0]}
                    name="Chiffre d'affaires (DA)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ROW : RÉPARTITION DU CA PAR ESPACE (PIECHART) ET TABLEAU DE SYNTHÈSE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* PieChart Répartition */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-black text-[#064E3B] flex items-center space-x-2">
                  <PieIcon className="w-5 h-5 text-[#F59E0B]" />
                  <span>Répartition du CA par Espace</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Part de chaque espace (salles de réunion, conférence, chaises coworking, bureau PME)
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByRoomData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {revenueByRoomData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatDA(Number(val)), "Chiffre d'affaires"]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100 max-h-44 overflow-y-auto pr-1">
                {revenueByRoomData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-bold text-gray-800 truncate">{item.nom}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-[#064E3B] block">
                        {formatDA(item.value)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {totalRevenue > 0 ? Math.round((item.value / totalRevenue) * 100) : 0}% du total
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tableau Récapitulatif Granulaire */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-black text-[#064E3B]">
                    Synthèse Granulaire ({periodeLabel})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Détail par tranche : réservations, heures, taux (%) et recettes
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {granularChartData.length} périodes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-extrabold uppercase text-[10px]">
                      <th className="p-3">Créneau / Tranche</th>
                      <th className="p-3 text-center">Réservations</th>
                      <th className="p-3 text-center">Heures</th>
                      <th className="p-3 text-center">Taux Occ.</th>
                      <th className="p-3 text-right">CA Généré</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {granularChartData.map((row) => (
                      <tr key={row.key} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3 font-bold text-gray-900">{row.name}</td>
                        <td className="p-3 text-center text-gray-700">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full font-bold">
                            {row.reservationsCount}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-600 font-mono">
                          {row.heuresReservees} h
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              row.tauxOccupation >= 50
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.tauxOccupation >= 20
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {row.tauxOccupation}%
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-[#064E3B]">
                          {formatDA(row.chiffreAffaires)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-emerald-50/60 font-black text-xs text-[#064E3B] border-t-2 border-emerald-200">
                      <td className="p-3">TOTAL PÉRIODE</td>
                      <td className="p-3 text-center">
                        {activeReservations.length}
                      </td>
                      <td className="p-3 text-center font-mono">
                        {Math.round(totalBookedHours)} h
                      </td>
                      <td className="p-3 text-center">
                        {averageOccupancy}%
                      </td>
                      <td className="p-3 text-right text-sm">
                        {formatDA(totalRevenue)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SOUS-ONGLET : ANALYSE DÉTAILLÉE DES 45 CHAISES AVEC NUMÉRO (#1 À #45) */}
      {activeSubTab === 'chaises' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* En-tête de section chaises avec filtres rapides */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-xs font-black text-[#F59E0B] uppercase tracking-wider mb-1">
                  <Hash className="w-4 h-4" />
                  <span>Cartographie & Rentabilité des Postes de Travail</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#064E3B]">
                  ANALYSE DES 45 CHAISES NUMÉROTÉES (1 À 45)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Suivi individuel de chaque chaise pour la période : <span className="font-bold text-gray-700">{periodeLabel}</span>. Cliquez sur un numéro pour inspecter les sessions associées.
                </p>
              </div>

              {/* Filtre de statut des chaises */}
              <div className="flex items-center space-x-2 self-start md:self-auto bg-gray-50 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold">
                <span className="text-gray-500 px-2">Filtrer par demande :</span>
                <button
                  onClick={() => setChairStatusFilter('all')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    chairStatusFilter === 'all'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  Toutes (45)
                </button>
                <button
                  onClick={() => setChairStatusFilter('high')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    chairStatusFilter === 'high'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Forte (&ge;40%)
                </button>
                <button
                  onClick={() => setChairStatusFilter('medium')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    chairStatusFilter === 'medium'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  Moyenne (15-40%)
                </button>
                <button
                  onClick={() => setChairStatusFilter('low')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    chairStatusFilter === 'low'
                      ? 'bg-gray-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Faible / Dispo (&lt;15%)
                </button>
              </div>
            </div>

            {/* CARTE / HEATMAP DES 45 CHAISES NUMÉROTÉES */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="font-bold flex items-center space-x-1.5">
                  <span>Plan des Chaises INNID (1 à 45)</span>
                  <span className="text-gray-400 font-normal">
                    • Code couleur selon le taux d'occupation sur la période
                  </span>
                </span>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-md bg-[#064E3B]"></span>
                    <span>&ge; 40%</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-md bg-[#F59E0B]"></span>
                    <span>15% - 40%</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-md bg-gray-200 border border-gray-300"></span>
                    <span>&lt; 15%</span>
                  </span>
                </div>
              </div>

              {/* GRILLE DES 45 CHAISES */}
              <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-9 lg:grid-cols-9 gap-2.5">
                {chaisesStatsData.map((chair) => {
                  const isFilteredOut = chairStatusFilter !== 'all' && chair.demandLevel !== chairStatusFilter;
                  const isSelected = inspectingChairNum === chair.numero || selectedChaiseNum === String(chair.numero);

                  let bgStyle = 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400';
                  let badgeStyle = 'bg-gray-200 text-gray-700';

                  if (chair.demandLevel === 'high') {
                    bgStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:border-[#064E3B] hover:shadow-xs';
                    badgeStyle = 'bg-[#064E3B] text-white';
                  } else if (chair.demandLevel === 'medium') {
                    bgStyle = 'bg-amber-50 border-amber-300 text-amber-950 hover:border-[#F59E0B] hover:shadow-xs';
                    badgeStyle = 'bg-[#F59E0B] text-white';
                  }

                  if (isSelected) {
                    bgStyle += ' ring-2 ring-[#064E3B] ring-offset-1 font-bold shadow-md';
                  }

                  if (isFilteredOut) {
                    bgStyle += ' opacity-25';
                  }

                  return (
                    <button
                      key={chair.numero}
                      id={`chair-btn-${chair.numero}`}
                      onClick={() => {
                        setInspectingChairNum(chair.numero);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between relative ${bgStyle}`}
                    >
                      {/* Numéro de la chaise */}
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${badgeStyle}`}>
                        N° {String(chair.numero).padStart(2, '0')}
                      </span>

                      {/* Taux d'occupation de la chaise */}
                      <div className="my-1.5">
                        <span className="text-sm font-black block leading-tight">
                          {chair.tauxOccupation}%
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">
                          {chair.heuresReservees}h
                        </span>
                      </div>

                      {/* Recettes générées par la chaise */}
                      <span className="text-[10px] font-extrabold text-[#064E3B] block truncate w-full">
                        {chair.chiffreAffaires > 0 ? `${(chair.chiffreAffaires / 1000).toFixed(0)}k` : '0'} DA
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FICHE D'INSPECTION DE LA CHAISE SÉLECTIONNÉE */}
          {inspectingChairNum !== null && (
            <div className="bg-gradient-to-r from-emerald-900 to-[#064E3B] text-white rounded-3xl p-6 sm:p-8 shadow-sm animate-in fade-in">
              {(() => {
                const chair = chaisesStatsData.find((c) => c.numero === inspectingChairNum);
                if (!chair) return null;

                return (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-2 bg-[#F59E0B] text-white text-xs font-black px-3 py-1 rounded-xl">
                        <Hash className="w-3.5 h-3.5" />
                        <span>FICHE POSTE DE TRAVAIL</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Chaise Coworking N° {String(chair.numero).padStart(2, '0')}
                      </h4>
                      <p className="text-xs text-emerald-200 max-w-xl">
                        Statistiques individuelles calculées pour la période : {periodeLabel}.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                          Taux d'Occ.
                        </span>
                        <span className="text-xl font-black text-white">{chair.tauxOccupation}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                          Sessions
                        </span>
                        <span className="text-xl font-black text-white">{chair.reservationsCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                          Heures
                        </span>
                        <span className="text-xl font-black text-white">{chair.heuresReservees} h</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                          CA Généré
                        </span>
                        <span className="text-lg font-black text-[#F59E0B]">
                          {formatDA(chair.chiffreAffaires)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedChaiseNum(String(chair.numero));
                          setActiveSubTab('synthese');
                        }}
                        className="bg-[#F59E0B] hover:bg-[#d98206] text-white font-black px-4 py-2 rounded-xl text-xs transition-all shadow-xs"
                      >
                        Filtrer les graphiques sur cette chaise
                      </button>
                      <button
                        onClick={() => setInspectingChairNum(null)}
                        className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* GRAPHIQUE RECHARTS : TOP 10 DES CHAISES LES PLUS RÉSERVÉES */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#064E3B] flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-[#F59E0B]" />
                  <span>Palmarès : Top 10 des Chaises les plus Sollicitées</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Volume d'heures cumulées et chiffre d'affaires par numéro de chaise
                </p>
              </div>

              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
                Parc Coworking (45 chaises)
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topChaisesChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    unit="h"
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => {
                      const nameStr = String(name || '');
                      if (nameStr === 'Heures réservées') return [`${val} heures`, nameStr];
                      if (nameStr === "Chiffre d'affaires") return [formatDA(Number(val)), nameStr];
                      return [`${val}%`, nameStr];
                    }}
                    labelFormatter={(label) => `Chaise ${label}`}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="heures"
                    fill="#064E3B"
                    radius={[6, 6, 0, 0]}
                    name="Heures réservées"
                  />
                  <Bar
                    dataKey="tauxOccupation"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                    name="Taux d'occupation (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLEAU COMPLET DES 45 CHAISES NUMÉROTÉES */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#064E3B]">
                  Tableau exhaustif des 45 Chaises ({periodeLabel})
                </h3>
                <p className="text-xs text-gray-500">
                  Numéro de poste, sessions enregistrées, volume horaire et recettes
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-gray-400">
                Chaises #01 à #45
              </span>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="text-gray-600 font-extrabold uppercase text-[10px]">
                    <th className="p-3">Chaise Numéro</th>
                    <th className="p-3 text-center">Taux d'Occupation</th>
                    <th className="p-3 text-center">Sessions</th>
                    <th className="p-3 text-center">Heures Cumulées</th>
                    <th className="p-3 text-right">CA Généré (DA)</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredChaisesForGrid.map((c) => (
                    <tr key={c.numero} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="p-3 font-bold text-gray-900 flex items-center space-x-2">
                        <span className="bg-[#064E3B] text-white text-[10px] font-black px-2 py-0.5 rounded-md font-mono">
                          #{String(c.numero).padStart(2, '0')}
                        </span>
                        <span>Poste de travail {c.numero}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            c.tauxOccupation >= 40
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.tauxOccupation >= 15
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {c.tauxOccupation}%
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-700 font-semibold">
                        {c.reservationsCount}
                      </td>
                      <td className="p-3 text-center font-mono text-gray-600">
                        {c.heuresReservees} h
                      </td>
                      <td className="p-3 text-right font-black text-[#064E3B]">
                        {formatDA(c.chiffreAffaires)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setInspectingChairNum(c.numero)}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                        >
                          Inspecter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
