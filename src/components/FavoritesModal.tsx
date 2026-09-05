import React from 'react';
import { X, Heart, Trash2, ArrowRight, Eye, MessageCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { formatBRL, formatNumber, createWhatsAppLink } from '../utils';

interface FavoritesModalProps {
  isOpen: boolean;
  favoriteVehicles: Vehicle[];
  onClose: () => void;
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  favoriteVehicles,
  onClose,
  onRemoveFavorite,
  onClearFavorites,
  onSelectVehicle,
}) => {
  if (!isOpen) return null;

  const handleWhatsAppAll = () => {
    const names = favoriteVehicles.map(v => `${v.brand} ${v.model} (${formatBRL(v.price)})`).join(', ');
    const msg = `Olá! Salvei os seguintes veículos nos meus favoritos da ShopCar e gostaria de receber uma proposta especial: ${names}.`;
    window.open(createWhatsAppLink(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="favorites-modal-container"
        className="bg-[#0a0a0a] border border-zinc-800 rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20">
              <Heart className="w-5 h-5 fill-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Seus Veículos Salvos
              </h2>
              <p className="text-xs text-zinc-400">
                {favoriteVehicles.length} {favoriteVehicles.length === 1 ? 'veículo guardado' : 'veículos guardados'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {favoriteVehicles.length > 0 && (
              <button
                onClick={onClearFavorites}
                className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar lista</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {favoriteVehicles.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <Heart className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold text-white">Sua garagem de favoritos está vazia</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Ao navegar pelos veículos do estoque, clique no coração para salvar modelos e consultá-los depois.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                Explorar Veículos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteVehicles.map((car) => (
                <div
                  key={car.id}
                  className="bg-[#141414] p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-red-600/40 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={car.images[0]}
                      alt={car.model}
                      className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-xl shrink-0 border border-zinc-800"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-red-500">
                        {car.brand} • {car.category}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">
                        {car.model}
                      </h4>
                      <p className="text-xs text-zinc-400">{car.version}</p>
                      <div className="text-xs text-zinc-400 mt-1">
                        {car.yearModel} • {formatNumber(car.km)} km • {car.fuel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <div className="text-left sm:text-right">
                      <span className="text-base font-black text-white block">
                        {formatBRL(car.price)}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        FIPE: {formatBRL(car.fipePrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectVehicle(car);
                        }}
                        className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-1 border border-zinc-800 cursor-pointer"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden md:inline">Detalhes</span>
                      </button>

                      <button
                        onClick={() => onRemoveFavorite(car.id)}
                        className="p-2.5 rounded-xl bg-zinc-900 hover:bg-red-600/20 text-zinc-400 hover:text-red-500 transition-colors border border-zinc-800 cursor-pointer"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleWhatsAppAll}
                  className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Negociar Todos os Salvos no WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
