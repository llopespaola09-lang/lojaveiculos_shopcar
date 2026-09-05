import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  MapPin,
  MessageCircle,
  Eye,
  Check
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatBRL, formatNumber, calculateInstallment, createWhatsAppLink } from '../utils';

interface CarCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSimulateFinance: (vehicle: Vehicle) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  vehicle,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectVehicle,
  onSimulateFinance,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  // 40% down payment simulation
  const downPayment = vehicle.price * 0.4;
  const simulatedInstallment = calculateInstallment(vehicle.price - downPayment, 16.5, 48);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Olá! Vi o ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearModel}) por ${formatBRL(vehicle.price)} no site da ShopCar e gostaria de negociar.`;
    window.open(createWhatsAppLink(msg), '_blank');
  };

  return (
    <div 
      id={`car-card-${vehicle.id}`}
      className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-red-600/30 rounded-[32px] p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-red-600/5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image Area with Controls */}
        <div 
          className="relative h-56 sm:h-60 w-full overflow-hidden rounded-2xl bg-[#141414] cursor-pointer mb-5"
          onClick={() => onSelectVehicle(vehicle)}
        >
          <img
            src={vehicle.images[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient overlay on top & bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/40 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {vehicle.tag && (
              <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded shadow">
                {vehicle.tag}
              </span>
            )}
            {vehicle.cautelarApproved && (
              <span className="bg-zinc-950/90 border border-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Cautelar 100%
              </span>
            )}
          </div>

          {/* Top Action Buttons (Favorite + Compare) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              type="button"
              id={`btn-compare-${vehicle.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(vehicle);
              }}
              title={isCompared ? 'Remover do comparador' : 'Adicionar ao comparador'}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                isCompared
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-950/70 hover:bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
            </button>

            <button
              type="button"
              id={`btn-favorite-${vehicle.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(vehicle.id);
              }}
              title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              className="p-2 rounded-xl bg-zinc-950/70 hover:bg-zinc-900 backdrop-blur-md transition-all shadow-md"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? 'text-red-500 fill-red-500' : 'text-zinc-300 hover:text-white'
                }`} 
              />
            </button>
          </div>

          {/* Carousel Prev/Next Buttons */}
          {vehicle.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/70 hover:bg-zinc-900 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/70 hover:bg-zinc-900 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {vehicle.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-4 bg-red-600' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Content */}
        <div>
          {/* Brand, Category & Year */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-bold text-red-500 text-[10px] uppercase tracking-widest">
              {vehicle.brand} • {vehicle.category}
            </span>
            <span className="text-[10px] text-zinc-500 font-bold px-2 py-0.5 border border-zinc-800 rounded bg-zinc-950/60">
              {vehicle.yearModel}
            </span>
          </div>

          {/* Model & Version */}
          <h3 
            onClick={() => onSelectVehicle(vehicle)}
            className="text-lg font-bold text-white group-hover:text-red-500 transition-colors cursor-pointer line-clamp-1 font-['Space_Grotesk']"
          >
            {vehicle.model}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-1 mb-4">
            {vehicle.version}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-zinc-800/60 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{vehicle.yearModel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formatNumber(vehicle.km)} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-zinc-500" />
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-zinc-500" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-4 mt-2">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-black text-white tracking-tight">
            {formatBRL(vehicle.price)}
          </span>
          <span className="text-[11px] text-zinc-500 line-through font-medium">
            FIPE: {formatBRL(vehicle.fipePrice)}
          </span>
        </div>

        {/* Financed simulation line */}
        <div 
          onClick={() => onSimulateFinance(vehicle)}
          className="text-xs text-red-500 hover:text-red-400 cursor-pointer font-medium mb-4 flex items-center justify-between"
        >
          <span>Simulação: Entrada + 48x de {formatBRL(simulatedInstallment)}</span>
          <span className="underline text-[10px] font-bold">simular</span>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            id={`btn-details-${vehicle.id}`}
            onClick={() => onSelectVehicle(vehicle)}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detalhes</span>
          </button>

          <button
            type="button"
            id={`btn-whatsapp-${vehicle.id}`}
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-red-600/20 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Proposta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
