import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Scale, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  Search, 
  MessageCircle,
  Calculator,
  Trophy,
  Zap,
  Gauge
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatBRL, formatNumber, createWhatsAppLink } from '../utils';

interface CompareModalProps {
  isOpen: boolean;
  comparedVehicles: Vehicle[];
  allVehicles?: Vehicle[];
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onAddToCompare: (vehicle: Vehicle) => void;
  onClearCompare: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenFinancing?: (vehicle: Vehicle) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  comparedVehicles,
  allVehicles = [],
  onClose,
  onRemoveFromCompare,
  onAddToCompare,
  onClearCompare,
  onSelectVehicle,
  onOpenFinancing,
}) => {
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  if (!isOpen) return null;

  // Filter vehicles available to add (exclude already compared)
  const availableToAdd = allVehicles.filter(
    (car) => !comparedVehicles.some((c) => c.id === car.id) &&
    (pickerSearch === '' || 
     car.model.toLowerCase().includes(pickerSearch.toLowerCase()) ||
     car.brand.toLowerCase().includes(pickerSearch.toLowerCase()))
  );

  // Best-in-class calculations if at least 2 vehicles
  const minPriceId = comparedVehicles.length > 1
    ? comparedVehicles.reduce((min, c) => (c.price < min.price ? c : min), comparedVehicles[0])?.id
    : null;

  const minKmId = comparedVehicles.length > 1
    ? comparedVehicles.reduce((min, c) => (c.km < min.km ? c : min), comparedVehicles[0])?.id
    : null;

  const maxPowerId = comparedVehicles.length > 1
    ? comparedVehicles.reduce((max, c) => (c.powerHp > max.powerHp ? c : max), comparedVehicles[0])?.id
    : null;

  const handleWhatsAppCompare = () => {
    if (comparedVehicles.length === 0) return;
    const carList = comparedVehicles.map((c) => `- ${c.brand} ${c.model} (${c.yearModel}) - ${formatBRL(c.price)}`).join('\n');
    const msg = `Olá! Gostaria de consultar os seguintes veículos que comparei no site da ShopCar:\n${carList}\nPoderiam me enviar mais detalhes sobre as condições de negociação de cada um?`;
    window.open(createWhatsAppLink(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="compare-modal-box"
        className="bg-[#0f0f0f] border border-zinc-800 rounded-[32px] w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/10 text-red-500 border border-red-600/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Comparador Inteligente de Veículos
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
                  {comparedVehicles.length} de 3
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Compare especificações técnicas, desempenho, porta-malas e custos lado a lado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedVehicles.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs font-bold text-zinc-400 hover:text-red-400 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
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

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* If 0 vehicles selected: Interactive Initial Selector */}
          {comparedVehicles.length === 0 ? (
            <div className="text-center py-8 space-y-6">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Scale className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Nenhum veículo selecionado para comparação
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Escolha 2 ou 3 veículos abaixo para analisar lado a lado valores, potência, consumo, porta-malas e opcionais.
                </p>
              </div>

              {/* Quick Vehicle Picker Grid */}
              <div className="text-left max-w-4xl mx-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Selecione veículos para iniciar:
                  </span>
                  <span className="text-xs text-zinc-500">
                    Clique em "+ Comparar"
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {allVehicles.slice(0, 6).map((car) => (
                    <div 
                      key={car.id}
                      className="bg-[#141414] border border-zinc-800 rounded-2xl p-3.5 flex items-center gap-3 hover:border-red-600/40 transition-colors"
                    >
                      <img 
                        src={car.images[0]} 
                        alt={car.model} 
                        className="w-16 h-12 object-cover rounded-xl shrink-0 border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-red-500 block uppercase truncate">
                          {car.brand}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {car.model}
                        </h4>
                        <span className="text-xs font-black text-zinc-300 block">
                          {formatBRL(car.price)}
                        </span>
                      </div>
                      <button
                        onClick={() => onAddToCompare(car)}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                      >
                        + Comparar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick in-modal vehicle add drawer if slots remain */}
              {comparedVehicles.length < 3 && showAddPicker && (
                <div className="bg-[#141414] border border-red-600/40 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-red-500" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Adicionar Veículo à Comparação
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowAddPicker(false)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="Buscar por marca ou modelo..."
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {availableToAdd.slice(0, 6).map((car) => (
                      <div 
                        key={car.id}
                        className="bg-[#0a0a0a] p-2.5 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={car.images[0]} alt={car.model} className="w-10 h-8 object-cover rounded-lg shrink-0" />
                          <div className="truncate">
                            <span className="text-[9px] text-red-500 font-bold uppercase block">{car.brand}</span>
                            <span className="text-xs font-bold text-white block truncate">{car.model}</span>
                            <span className="text-[10px] text-zinc-400">{formatBRL(car.price)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onAddToCompare(car);
                            setShowAddPicker(false);
                            setPickerSearch('');
                          }}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs shrink-0 cursor-pointer"
                          title="Adicionar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="p-4 w-44 text-xs font-bold text-zinc-500 uppercase tracking-wider align-top">
                        Especificação
                      </th>
                      {comparedVehicles.map((car) => (
                        <th key={car.id} className="p-4 w-64 align-top">
                          <div className="relative group bg-[#141414] p-4 rounded-2xl border border-zinc-800 hover:border-red-600/40 transition-colors flex flex-col justify-between h-full">
                            <button
                              onClick={() => onRemoveFromCompare(car.id)}
                              className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-900/90 hover:bg-red-600 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
                              title="Remover veículo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <div>
                              <img
                                src={car.images[0]}
                                alt={car.model}
                                className="w-full h-32 object-cover rounded-xl mb-3 cursor-pointer border border-zinc-800"
                                onClick={() => {
                                  onClose();
                                  onSelectVehicle(car);
                                }}
                              />
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                {car.brand} • {car.category}
                              </span>
                              <h4 
                                onClick={() => {
                                  onClose();
                                  onSelectVehicle(car);
                                }}
                                className="text-sm font-bold text-white hover:text-red-500 cursor-pointer truncate font-['Space_Grotesk']"
                              >
                                {car.model}
                              </h4>
                              <p className="text-xs text-zinc-400 truncate mb-2">{car.version}</p>
                              <div className="text-base font-black text-white">
                                {formatBRL(car.price)}
                              </div>
                            </div>

                            {/* Column Action Buttons */}
                            <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                              <button
                                onClick={() => {
                                  onClose();
                                  onSelectVehicle(car);
                                }}
                                className="w-full py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20"
                              >
                                <span>Ver Ficha Completa</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>

                              {onOpenFinancing && (
                                <button
                                  onClick={() => onOpenFinancing(car)}
                                  className="w-full py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-800"
                                >
                                  <Calculator className="w-3 h-3 text-red-500" />
                                  <span>Simular Financiamento</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </th>
                      ))}

                      {/* Empty Slots */}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <th key={i} className="p-4 w-64 align-middle text-center">
                          <button
                            onClick={() => setShowAddPicker(true)}
                            className="w-full h-full min-h-[260px] border-2 border-dashed border-zinc-800 hover:border-red-600/60 rounded-2xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all bg-[#0a0a0a]/50 hover:bg-[#141414] cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 group-hover:bg-red-600 text-zinc-400 group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                              <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                              Adicionar Veículo
                            </span>
                            <span className="text-[11px] text-zinc-600 group-hover:text-zinc-400">
                              Clique para escolher
                            </span>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-800/60 text-xs">
                    {/* Preço de Tabela */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Preço de Venda</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 font-black text-white text-sm">
                          {formatBRL(car.price)}
                          {car.id === minPriceId && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Trophy className="w-2.5 h-2.5" /> Melhor Valor
                            </span>
                          )}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Ano / Modelo */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Ano de Fabricação / Modelo</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 font-bold text-zinc-200">{car.yearModel}</td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Quilometragem */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Quilometragem</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-zinc-200">
                          {formatNumber(car.km)} km
                          {car.id === minPriceId && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                              <Gauge className="w-2.5 h-2.5" /> Mais Novo
                            </span>
                          )}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Potência */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Potência do Motor</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 font-bold text-red-500">
                          {car.powerHp} cv
                          {car.id === maxPowerId && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              <Zap className="w-2.5 h-2.5" /> Mais Potente
                            </span>
                          )}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Aceleração */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">0 a 100 km/h</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-zinc-200 font-semibold">{car.acceleration0to100}</td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Motor */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Motorização</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-zinc-300">{car.engine}</td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Câmbio e Combustível */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Combustível & Transmissão</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-zinc-300">{car.fuel} • {car.transmission}</td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Porta-Malas */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Capacidade Porta-Malas</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-zinc-200 font-semibold">{car.trunkCapacityLiters} Litros</td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Consumo */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Consumo (Cidade / Estrada)</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-emerald-400 font-medium">
                          {car.consumptionCity} / {car.consumptionHighway}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Garantia */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Garantia ShopCar</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-zinc-200">{car.warrantyMonths} Meses Inclusos</td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>

                    {/* Laudo Cautelar */}
                    <tr>
                      <td className="p-4 font-semibold text-zinc-400">Laudo Pericial</td>
                      {comparedVehicles.map((car) => (
                        <td key={car.id} className="p-4 text-emerald-400 font-semibold">
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[11px]">
                            <Check className="w-3.5 h-3.5" /> 100% Aprovado
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedVehicles.length }).map((_, i) => (
                        <td key={i} className="p-4 text-zinc-700">-</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom WhatsApp CTA */}
              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-zinc-400">
                  Tem dúvidas sobre qual escolher? Fale com um consultor especialista da ShopCar.
                </p>
                <button
                  onClick={handleWhatsAppCompare}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Negociar Comparativo via WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
