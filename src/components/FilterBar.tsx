import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  ArrowUpDown,
  DollarSign,
  Gauge
} from 'lucide-react';
import { FilterState, VehicleCategory } from '../types';
import { BRANDS_LIST, CATEGORIES_LIST } from '../data/cars';
import { formatBRL, formatNumber } from '../utils';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  totalResults,
}) => {
  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.category !== 'Todos' ||
    filters.brand !== 'Todas' ||
    filters.maxPrice < 1000000 ||
    filters.maxKm < 100000 ||
    filters.transmission !== 'Todas' ||
    filters.fuel !== 'Todos';

  return (
    <div className="bg-[#141414] border border-zinc-800 rounded-[28px] p-6 mb-8 backdrop-blur-xl shadow-2xl">
      {/* Top row: Header & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-wider text-white font-['Space_Grotesk']">
              Filtrar Estoque
            </h2>
            <p className="text-[11px] text-zinc-500 font-medium">
              {totalResults} {totalResults === 1 ? 'veículo disponível' : 'veículos disponíveis'}
            </p>
          </div>
        </div>

        {/* Sort selector & reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 px-3.5 py-1.5 rounded-xl border border-zinc-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider hidden sm:inline">Ordenar:</span>
            <select
              id="sort-by-select"
              value={filters.sortBy}
              onChange={(e) => onChangeFilter('sortBy', e.target.value as FilterState['sortBy'])}
              className="bg-transparent text-xs text-zinc-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="recommended" className="bg-zinc-900">Em Destaque</option>
              <option value="price-asc" className="bg-zinc-900">Menor Preço</option>
              <option value="price-desc" className="bg-zinc-900">Maior Preço</option>
              <option value="km-asc" className="bg-zinc-900">Menor Quilometragem</option>
              <option value="year-desc" className="bg-zinc-900">Mais Novo (Ano)</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              id="reset-filters-btn"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-500 px-3 py-2 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories chips bar */}
      <div className="py-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-zinc-800/60">
        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider shrink-0 mr-1">Categoria:</span>
        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat}
            onClick={() => onChangeFilter('category', cat as VehicleCategory)}
            className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
              filters.category === cat
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of detailed filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        {/* Brand */}
        <div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Marca</label>
          <select
            value={filters.brand}
            onChange={(e) => onChangeFilter('brand', e.target.value)}
            className="w-full bg-zinc-950 text-xs text-zinc-200 py-2.5 px-3 rounded-xl border border-zinc-800/80 focus:outline-none focus:border-red-600"
          >
            {BRANDS_LIST.map((b) => (
              <option key={b} value={b} className="bg-zinc-900">
                {b === 'Todas' ? 'Todas as marcas' : b}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price Slider */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400 flex items-center gap-1 font-medium">
              <DollarSign className="w-3 h-3 text-red-500" />
              Preço Máximo:
            </span>
            <span className="text-red-500 font-bold">
              {filters.maxPrice >= 1000000 ? 'Sem limite' : formatBRL(filters.maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min="100000"
            max="1000000"
            step="20000"
            value={filters.maxPrice}
            onChange={(e) => onChangeFilter('maxPrice', Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        {/* Max Km */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400 flex items-center gap-1 font-medium">
              <Gauge className="w-3 h-3 text-zinc-500" />
              Km Máxima:
            </span>
            <span className="text-zinc-200 font-bold">
              {filters.maxKm >= 100000 ? 'Qualquer km' : `Até ${formatNumber(filters.maxKm)} km`}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="100000"
            step="5000"
            value={filters.maxKm}
            onChange={(e) => onChangeFilter('maxKm', Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Combustível</label>
          <select
            value={filters.fuel}
            onChange={(e) => onChangeFilter('fuel', e.target.value)}
            className="w-full bg-zinc-950 text-xs text-zinc-200 py-2.5 px-3 rounded-xl border border-zinc-800/80 focus:outline-none focus:border-red-600"
          >
            <option value="Todos" className="bg-zinc-900">Todos os combustíveis</option>
            <option value="Híbrido" className="bg-zinc-900">Híbrido</option>
            <option value="Elétrico" className="bg-zinc-900">Elétrico</option>
            <option value="Flex" className="bg-zinc-900">Flex</option>
            <option value="Gasolina" className="bg-zinc-900">Gasolina</option>
            <option value="Diesel" className="bg-zinc-900">Diesel</option>
          </select>
        </div>
      </div>
    </div>
  );
};
