import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';

interface CompareFloatingBarProps {
  comparedVehicles: Vehicle[];
  onOpenCompare: () => void;
  onRemoveVehicle: (id: string) => void;
  onClear: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  comparedVehicles,
  onOpenCompare,
  onRemoveVehicle,
  onClear,
}) => {
  if (comparedVehicles.length === 0) return null;

  return (
    <aside 
      aria-label="Barra de comparação de veículos"
      id="compare-floating-bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-[#141414]/95 border border-red-600/40 rounded-[24px] shadow-2xl backdrop-blur-xl px-5 py-3 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 shrink-0">
          <Scale className="w-4 h-4" />
          <span className="hidden sm:inline">Comparar:</span>
          <span>{comparedVehicles.length}/3</span>
        </div>

        <div className="flex items-center gap-2">
          {comparedVehicles.map((car) => (
            <div key={car.id} className="relative group shrink-0">
              <img
                src={car.images[0]}
                alt={car.model}
                className="w-12 h-10 object-cover rounded-xl border border-zinc-800"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveVehicle(car.id);
                }}
                className="absolute -top-1 -right-1 bg-zinc-950 text-zinc-400 hover:text-red-500 rounded-full p-0.5 border border-zinc-800"
                title="Remover"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onClear}
          className="text-xs font-bold text-zinc-400 hover:text-white px-2.5 py-1 transition-colors cursor-pointer"
        >
          Limpar
        </button>
        <button
          id="btn-open-floating-compare"
          onClick={onOpenCompare}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
        >
          <span>Comparar Agora</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
