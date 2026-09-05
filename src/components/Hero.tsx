import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  BadgePercent, 
  Truck, 
  Search, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { BRANDS_LIST, CATEGORIES_LIST } from '../data/cars';
import { VehicleCategory } from '../types';

interface HeroProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (cat: VehicleCategory) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  totalCarsCount: number;
  filteredCount: number;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  totalCarsCount,
  filteredCount,
  onScrollToCatalog,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-zinc-800/50">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-600/10 via-red-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative automotive wireframe from Elegant Dark design */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden xl:block">
        <svg width="650" height="300" viewBox="0 0 700 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 280 Q100 150 400 150 L650 180 L680 250 L650 320 L50 320 Z" stroke="white" strokeWidth="2" fill="none"/>
          <circle cx="180" cy="300" r="45" stroke="white" strokeWidth="2"/>
          <circle cx="550" cy="300" r="45" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings & Value Props */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-[10px] font-black uppercase tracking-widest text-red-500">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Premium Experience • Estoque 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-['Space_Grotesk']">
              Acelere seu próximo{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                sonho.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              Mais de {totalCarsCount} veículos periciados com laudo cautelar 100% aprovado, 
              garantia estendida, simulação de financiamento transparente e entrega segura em todo o Brasil.
            </p>

            {/* Trust Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/60 hover:border-red-600/30 transition-colors px-3 py-2.5 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-zinc-300">100% Periciados</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/60 hover:border-red-600/30 transition-colors px-3 py-2.5 rounded-2xl">
                <BadgePercent className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs font-semibold text-zinc-300">Taxas Especiais</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/60 hover:border-red-600/30 transition-colors px-3 py-2.5 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
                <span className="text-xs font-semibold text-zinc-300">Garantia até 2 Anos</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/60 hover:border-red-600/30 transition-colors px-3 py-2.5 rounded-2xl">
                <Truck className="w-4 h-4 text-zinc-300 shrink-0" />
                <span className="text-xs font-semibold text-zinc-300">Entrega VIP</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Filter Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#141414] border border-zinc-800 rounded-[32px] p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-5">
                <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2 font-['Space_Grotesk']">
                  <Search className="w-4 h-4 text-red-500" />
                  Busca Rápida
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
                  {filteredCount} disponíveis
                </span>
              </div>

              {/* Category Segmented Control */}
              <div className="space-y-2 mb-4">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Carroçaria / Categoria
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onSelectCategory(cat as VehicleCategory)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                        selectedCategory === cat
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Selector */}
              <div className="space-y-2 mb-5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Marca
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => onSelectBrand(e.target.value)}
                  className="w-full bg-zinc-950 text-xs font-medium text-zinc-200 py-2.5 px-3.5 rounded-xl border border-zinc-800/80 focus:outline-none focus:border-red-600"
                >
                  {BRANDS_LIST.map((b) => (
                    <option key={b} value={b} className="bg-zinc-900 text-zinc-100">
                      {b === 'Todas' ? 'Todas as marcas' : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <button
                id="hero-explore-catalog-btn"
                onClick={onScrollToCatalog}
                className="w-full group bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
              >
                <span>Explorar Estoque ({filteredCount} Carros)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                <span>✓ Simulação instantânea</span>
                <span>✓ Atendimento personalizado</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
