import React, { useState } from 'react';
import { 
  Car, 
  Heart, 
  Scale, 
  PhoneCall, 
  Calculator, 
  PlusCircle, 
  Menu, 
  X, 
  ShieldCheck,
  Search,
  Database,
  Plus
} from 'lucide-react';
import { createWhatsAppLink } from '../utils';

interface NavbarProps {
  favoriteCount: number;
  compareCount: number;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onOpenFinancingModal: () => void;
  onOpenSellModal: () => void;
  onOpenAddVehicle?: () => void;
  onNavigateToCatalog: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  firebaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoriteCount,
  compareCount,
  onOpenFavorites,
  onOpenCompare,
  onOpenFinancingModal,
  onOpenSellModal,
  onOpenAddVehicle,
  onNavigateToCatalog,
  searchQuery,
  onSearchChange,
  firebaseConnected = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWhatsAppGeneral = () => {
    window.open(
      createWhatsAppLink('Olá! Gostaria de mais informações sobre os veículos do estoque da ShopCar.'),
      '_blank'
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/50 bg-[#0a0a0a]/95 backdrop-blur-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-1.5 px-4 text-center text-[11px] font-bold text-white tracking-[0.18em] uppercase">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Feirão ShopCar Exclusive: Taxas especiais a partir de 0,99% a.m. + IPVA 2026 Grátis
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={onNavigateToCatalog}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-red-600/30 transition-transform group-hover:rotate-6">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="text-2xl font-black tracking-tighter uppercase text-white font-['Space_Grotesk']">
                  SHOP<span className="text-red-600">CAR</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-600/10 text-red-500 border border-red-600/20">
                  Exclusive
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em] ml-1">
                Veículos Novos & Seminovos
              </p>
            </div>
          </div>

          {/* Search Box on Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                id="navbar-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por marca, modelo ou versão (ex: BMW, Porsche, SUV)..."
                className="w-full bg-zinc-900/60 text-xs text-zinc-200 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800/80 focus:outline-none focus:border-red-600/70 focus:ring-1 focus:ring-red-600/40 placeholder:text-zinc-500 transition-all"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')} 
                  className="absolute right-3 top-3 text-xs text-zinc-400 hover:text-white"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <button
              id="nav-catalog-btn"
              onClick={onNavigateToCatalog}
              className="hover:text-red-500 transition-colors cursor-pointer"
            >
              Estoque
            </button>
            <button
              id="nav-financing-btn"
              onClick={onOpenFinancingModal}
              className="hover:text-red-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-red-500" />
              Financiamento
            </button>
            <button
              id="nav-sell-btn"
              onClick={onOpenSellModal}
              className="hover:text-red-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
              Vender Carro
            </button>
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3">
            {/* Firebase Live Status */}
            <div 
              title="Banco de dados Firebase Firestore conectado em tempo real"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] border border-zinc-800 text-[10px] font-semibold text-zinc-300"
            >
              <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{firebaseConnected ? 'Firebase Conectado' : 'Sincronizando...'}</span>
            </div>

            {/* Add Vehicle Button (Admin / Dealer) */}
            {onOpenAddVehicle && (
              <button
                id="nav-add-vehicle-btn"
                onClick={onOpenAddVehicle}
                title="Cadastrar novo veículo no banco de dados Firestore"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600/50 text-[11px] font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-red-500" />
                <span>+ Cadastrar</span>
              </button>
            )}

            {/* Compare Button */}
            <button
              id="nav-compare-trigger"
              onClick={onOpenCompare}
              title="Comparador de Veículos Lado a Lado"
              className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 rounded-xl transition-colors cursor-pointer"
            >
              <Scale className="w-4 h-4 text-zinc-300 hover:text-red-500" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <button
              id="nav-favorites-trigger"
              onClick={onOpenFavorites}
              title="Veículos Salvos"
              className="relative p-2.5 text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 rounded-xl transition-colors"
            >
              <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'text-red-500 fill-red-500' : 'text-zinc-300'}`} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Fale Conosco / WhatsApp CTA */}
            <button
              id="nav-whatsapp-direct-btn"
              onClick={handleWhatsAppGeneral}
              className="hidden sm:inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-black/40 active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Fale Conosco</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/60 border border-zinc-800 rounded-xl md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800/80 space-y-3">
            <div className="relative w-full mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar veículo..."
                className="w-full bg-zinc-900 text-sm text-zinc-200 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>

            <button
              onClick={() => {
                onNavigateToCatalog();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-900 rounded-lg flex items-center gap-2.5"
            >
              <Car className="w-4 h-4 text-red-500" />
              Estoque de Veículos
            </button>
            <button
              onClick={() => {
                onOpenFinancingModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-900 rounded-lg flex items-center gap-2.5"
            >
              <Calculator className="w-4 h-4 text-red-500" />
              Simular Financiamento
            </button>
            <button
              onClick={() => {
                onOpenSellModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-900 rounded-lg flex items-center gap-2.5"
            >
              <PlusCircle className="w-4 h-4 text-zinc-400" />
              Vender Meu Carro
            </button>
            {onOpenAddVehicle && (
              <button
                onClick={() => {
                  onOpenAddVehicle();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-900 rounded-lg flex items-center gap-2.5"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                Cadastrar Veículo (Firebase)
              </button>
            )}
            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-900 rounded-lg flex items-center gap-2.5"
            >
              <Scale className="w-4 h-4 text-red-500" />
              Comparador ({compareCount} selecionados)
            </button>
            <button
              onClick={handleWhatsAppGeneral}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              <PhoneCall className="w-4 h-4" />
              Atendimento WhatsApp
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
