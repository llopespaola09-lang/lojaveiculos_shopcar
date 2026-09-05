import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VEHICLES_DATA } from './data/cars';
import { Vehicle, FilterState, VehicleCategory } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { CarCard } from './components/CarCard';
import { CarDetailModal } from './components/CarDetailModal';
import { CompareModal } from './components/CompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { FinancingCalculatorModal } from './components/FinancingCalculatorModal';
import { SellCarModal } from './components/SellCarModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AddVehicleModal } from './components/AddVehicleModal';
import { TrustBadges } from './components/TrustBadges';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { syncVehiclesCollection, initAuth } from './lib/firebase';
import { 
  Car, 
  Sparkles, 
  CheckCircle, 
  SearchX, 
  RotateCcw,
  BadgeAlert
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'Todos',
  brand: 'Todas',
  minPrice: 0,
  maxPrice: 1000000,
  maxKm: 100000,
  transmission: 'Todas',
  fuel: 'Todos',
  minYear: 2020,
  sortBy: 'recommended',
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  
  // Real-time Firebase Vehicles & Connection State
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES_DATA);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Modals & Drawers
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [financePreselectedVehicle, setFinancePreselectedVehicle] = useState<Vehicle | null>(null);
  const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync with Firebase Firestore on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSync = async () => {
      try {
        await initAuth();
        unsubscribe = await syncVehiclesCollection(
          (firestoreCars) => {
            if (firestoreCars && firestoreCars.length > 0) {
              setVehicles(firestoreCars);
            }
            setFirebaseConnected(true);
          },
          (err) => {
            console.warn('Firebase sync warning, fallback active:', err);
            setFirebaseConnected(false);
          }
        );
      } catch (e) {
        console.error('Firebase initialization error:', e);
      }
    };

    setupSync();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Favorites with localStorage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopcar_favorites');
      return saved ? JSON.parse(saved) : ['bmw-320i-msport-2024', 'toyota-corolla-cross-hybrid-2024'];
    } catch {
      return ['bmw-320i-msport-2024'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shopcar_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Veículo removido dos favoritos.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Veículo adicionado aos favoritos!');
        return [...prev, id];
      }
    });
  };

  // Compared vehicles (up to 3)
  const [comparedVehicles, setComparedVehicles] = useState<Vehicle[]>([]);

  const toggleCompare = (vehicle: Vehicle) => {
    setComparedVehicles((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);
      if (exists) {
        showToast(`Removido do comparador.`);
        return prev.filter((v) => v.id !== vehicle.id);
      } else {
        if (prev.length >= 3) {
          showToast('Você pode comparar no máximo 3 veículos simultaneamente.');
          return prev;
        }
        showToast(`${vehicle.brand} ${vehicle.model} adicionado ao comparador.`);
        return [...prev, vehicle];
      }
    });
  };

  const removeFromCompare = (id: string) => {
    setComparedVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const clearCompare = () => {
    setComparedVehicles([]);
  };

  // Filter change helper
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Reference to catalog for smooth scrolling
  const catalogRef = useRef<HTMLDivElement>(null);
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((car) => {
      // Search query
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesBrand = car.brand.toLowerCase().includes(query);
        const matchesModel = car.model.toLowerCase().includes(query);
        const matchesVersion = car.version.toLowerCase().includes(query);
        const matchesCity = car.city.toLowerCase().includes(query);
        const matchesCategory = car.category.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel && !matchesVersion && !matchesCity && !matchesCategory) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'Todos' && car.category !== filters.category) {
        return false;
      }

      // Brand
      if (filters.brand !== 'Todas' && car.brand !== filters.brand) {
        return false;
      }

      // Max Price
      if (filters.maxPrice < 1000000 && car.price > filters.maxPrice) {
        return false;
      }

      // Max Km
      if (filters.maxKm < 100000 && car.km > filters.maxKm) {
        return false;
      }

      // Fuel
      if (filters.fuel !== 'Todos' && car.fuel !== filters.fuel) {
        return false;
      }

      return true;
    });

    // Sort
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'km-asc') {
      result.sort((a, b) => a.km - b.km);
    } else if (filters.sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    } else {
      // Recommended: featured first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [filters, vehicles]);

  const favoriteVehiclesList = useMemo(() => {
    return vehicles.filter((v) => favoriteIds.includes(v.id));
  }, [favoriteIds, vehicles]);

  const openFinanceForVehicle = (vehicle: Vehicle) => {
    setFinancePreselectedVehicle(vehicle);
    setIsFinancingModalOpen(true);
  };

  const openGeneralFinance = () => {
    setFinancePreselectedVehicle(null);
    setIsFinancingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <aside 
          aria-label="Notificação do sistema"
          className="fixed top-24 right-6 z-50 bg-[#141414] border border-red-600/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200"
        >
          <CheckCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </aside>
      )}

      {/* Main Navigation */}
      <Navbar
        favoriteCount={favoriteIds.length}
        compareCount={comparedVehicles.length}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenFinancingModal={openGeneralFinance}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenAddVehicle={() => setIsAddVehicleModalOpen(true)}
        onNavigateToCatalog={scrollToCatalog}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange('searchQuery', q)}
        firebaseConnected={firebaseConnected}
      />

      {/* Hero Section */}
      <Hero
        selectedCategory={filters.category}
        onSelectCategory={(cat: VehicleCategory) => {
          handleFilterChange('category', cat);
          scrollToCatalog();
        }}
        selectedBrand={filters.brand}
        onSelectBrand={(brand: string) => {
          handleFilterChange('brand', brand);
          scrollToCatalog();
        }}
        totalCarsCount={vehicles.length}
        filteredCount={filteredVehicles.length}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Main Catalog Section */}
      <main ref={catalogRef} id="catalogo" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-xs font-bold text-red-500 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estoque Sincronizado via Firebase Firestore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              Catálogo de Veículos
            </h2>
          </div>

          <p className="text-xs text-zinc-400">
            Exibindo <span className="text-red-500 font-bold">{filteredVehicles.length}</span> de {vehicles.length} veículos cadastrados
          </p>
        </div>

        {/* Filter Controls Bar */}
        <FilterBar
          filters={filters}
          onChangeFilter={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredVehicles.length}
        />

        {/* Vehicles Grid or Empty State */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-[#141414] border border-zinc-800 rounded-[32px] p-12 text-center my-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <SearchX className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Nenhum veículo encontrado para estes filtros</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Tente ampliar a faixa de preço, selecionar "Todas as marcas" ou limpar os termos de busca para visualizar outros modelos disponíveis.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Filtros Padrão</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <CarCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={favoriteIds.includes(vehicle.id)}
                isCompared={comparedVehicles.some((v) => v.id === vehicle.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
                onSelectVehicle={(car) => setSelectedVehicle(car)}
                onSimulateFinance={openFinanceForVehicle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Trust & Differentials */}
      <div id="diferenciais">
        <TrustBadges />
      </div>

      {/* Testimonials */}
      <div id="depoimentos">
        <Testimonials />
      </div>

      {/* Footer */}
      <Footer
        onNavigateToCatalog={scrollToCatalog}
        onOpenFinancingModal={openGeneralFinance}
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      {/* Floating Compare Bar */}
      <CompareFloatingBar
        comparedVehicles={comparedVehicles}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onRemoveVehicle={removeFromCompare}
        onClear={clearCompare}
      />

      {/* Vehicle Detail Modal */}
      <CarDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        isFavorite={selectedVehicle ? favoriteIds.includes(selectedVehicle.id) : false}
        isCompared={selectedVehicle ? comparedVehicles.some((v) => v.id === selectedVehicle.id) : false}
        onToggleFavorite={toggleFavorite}
        onToggleCompare={toggleCompare}
        onScheduleTestDriveSuccess={(carName) => {
          showToast(`Test drive para ${carName} agendado com sucesso!`);
        }}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        comparedVehicles={comparedVehicles}
        allVehicles={vehicles}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveFromCompare={removeFromCompare}
        onAddToCompare={toggleCompare}
        onClearCompare={clearCompare}
        onSelectVehicle={(car) => setSelectedVehicle(car)}
        onOpenFinancing={(car) => openFinanceForVehicle(car)}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        favoriteVehicles={favoriteVehiclesList}
        onClose={() => setIsFavoritesModalOpen(false)}
        onRemoveFavorite={toggleFavorite}
        onClearFavorites={() => setFavoriteIds([])}
        onSelectVehicle={(car) => setSelectedVehicle(car)}
      />

      {/* Financing Calculator Modal */}
      <FinancingCalculatorModal
        isOpen={isFinancingModalOpen}
        preselectedVehicle={financePreselectedVehicle}
        onClose={() => setIsFinancingModalOpen(false)}
      />

      {/* Sell Your Car Modal */}
      <SellCarModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />

      {/* Add Vehicle to Firebase Firestore Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onSuccess={(carName) => {
          showToast(`Veículo ${carName} salvo com sucesso no Firebase!`);
        }}
      />
    </div>
  );
}
