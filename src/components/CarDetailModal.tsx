import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Scale, 
  ShieldCheck, 
  Share2, 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  Clock, 
  MessageCircle, 
  ChevronRight,
  Sparkles,
  MapPin,
  Car
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatBRL, formatNumber, calculateInstallment, createWhatsAppLink } from '../utils';
import { saveLead } from '../lib/firebase';

interface CarDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onScheduleTestDriveSuccess: (vehicleName: string) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  vehicle,
  onClose,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onScheduleTestDriveSuccess,
}) => {
  if (!vehicle) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'finance' | 'testdrive' | 'tradein'>('specs');

  // Financing Simulator State for this vehicle
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [installmentsCount, setInstallmentsCount] = useState<number>(48);

  // Test Drive Form State
  const [tdName, setTdName] = useState('');
  const [tdPhone, setTdPhone] = useState('');
  const [tdDate, setTdDate] = useState('2026-09-08');
  const [tdTime, setTdTime] = useState('14:00');
  const [tdUnit, setTdUnit] = useState('ShopCar São Paulo - Jardins');
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);

  // Trade-in form
  const [tradeInCar, setTradeInCar] = useState('');
  const [tradeInYear, setTradeInYear] = useState('');
  const [tradeInOffer, setTradeInOffer] = useState('');
  const [tradeInSubmitted, setTradeInSubmitted] = useState(false);

  // Calculated values
  const downPaymentAmount = (vehicle.price * downPaymentPercent) / 100;
  const loanPrincipal = Math.max(0, vehicle.price - downPaymentAmount);
  const calculatedMonthly = calculateInstallment(loanPrincipal, 16.5, installmentsCount);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleWhatsApp = (customMessage?: string) => {
    const text = customMessage || `Olá! Estou interessado no ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearModel}) anunciado por ${formatBRL(vehicle.price)}. Gostaria de saber mais informações.`;
    window.open(createWhatsAppLink(text), '_blank');
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tdName || !tdPhone) return;
    setTestDriveSubmitted(true);

    try {
      await saveLead({
        type: 'test_drive',
        name: tdName,
        phone: tdPhone,
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model}`,
        details: {
          date: tdDate,
          time: tdTime,
          unit: tdUnit,
          price: vehicle.price
        }
      });
    } catch (err) {
      console.error('Error saving test drive to Firestore:', err);
    }

    setTimeout(() => {
      onScheduleTestDriveSuccess(`${vehicle.brand} ${vehicle.model}`);
    }, 1200);
  };

  const handleTradeInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTradeInSubmitted(true);

    try {
      await saveLead({
        type: 'direct_inquiry',
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model}`,
        details: {
          intendedCar: `${vehicle.brand} ${vehicle.model}`,
          notes: 'Interesse com veículo na troca'
        }
      });
    } catch (err) {
      console.error('Error saving trade-in inquiry to Firestore:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="car-detail-modal-container"
        className="bg-[#0a0a0a] border border-zinc-800 rounded-[32px] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141414] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
              {vehicle.brand}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
              {vehicle.model} <span className="text-zinc-500 font-normal text-sm hidden sm:inline">{vehicle.version}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(vehicle)}
              title={isCompared ? 'Remover do comparador' : 'Adicionar ao comparador'}
              className={`p-2 rounded-xl transition-colors ${
                isCompared ? 'bg-red-600 text-white font-bold' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(vehicle.id)}
              title="Salvar veículo"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              title="Compartilhar"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              id="close-detail-modal-btn"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Gallery & Hero Pricing Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={vehicle.images[activeImageIndex]}
                  alt={vehicle.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {vehicle.tag && (
                    <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                      {vehicle.tag}
                    </span>
                  )}
                  {vehicle.cautelarApproved && (
                    <span className="bg-zinc-950/90 border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Laudo Aprovado
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-red-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Price & Purchase Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#141414] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {vehicle.city}, {vehicle.state}
                  </span>
                  <span>Placa final {vehicle.plateEnd}</span>
                </div>

                <div className="space-y-1 mb-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Preço Especial à Vista
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatBRL(vehicle.price)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>Tabela FIPE: <span className="line-through">{formatBRL(vehicle.fipePrice)}</span></span>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Economia de {formatBRL(vehicle.fipePrice - vehicle.price)}
                    </span>
                  </div>
                </div>

                {/* Key Summary Chips */}
                <div className="grid grid-cols-2 gap-2.5 py-4 border-y border-zinc-800 text-xs">
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Ano/Modelo</span>
                    <span className="text-zinc-100 font-bold">{vehicle.yearModel}</span>
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Quilometragem</span>
                    <span className="text-zinc-100 font-bold">{formatNumber(vehicle.km)} km</span>
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Câmbio</span>
                    <span className="text-zinc-100 font-bold">{vehicle.transmission}</span>
                  </div>
                  <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Garantia</span>
                    <span className="text-emerald-400 font-bold">{vehicle.warrantyMonths} meses ShopCar</span>
                  </div>
                </div>

                {/* Quick description excerpt */}
                <p className="text-xs text-zinc-400 mt-4 leading-relaxed line-clamp-3">
                  {vehicle.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleWhatsApp()}
                  className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Negociar no WhatsApp</span>
                </button>

                <button
                  onClick={() => setActiveTab('finance')}
                  className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  <span>Simular Parcelas deste Veículo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ficha Técnica
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'features'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Itens de Série ({vehicle.features.length})
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'finance'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Simulador de Financiamento
            </button>
            <button
              onClick={() => setActiveTab('testdrive')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'testdrive'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Agendar Test Drive
            </button>
            <button
              onClick={() => setActiveTab('tradein')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'tradein'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Avaliar Meu Carro na Troca
            </button>
          </div>

          {/* Tab 1: Technical Specs */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Motorização</span>
                <p className="text-sm font-bold text-zinc-100 mt-1">{vehicle.engine}</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Potência Máxima</span>
                <p className="text-sm font-bold text-zinc-100 mt-1">{vehicle.powerHp} cv</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Aceleração 0 a 100 km/h</span>
                <p className="text-sm font-bold text-red-500 mt-1">{vehicle.acceleration0to100}</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Velocidade Máxima</span>
                <p className="text-sm font-bold text-zinc-100 mt-1">{vehicle.topSpeed}</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Capacidade Porta-Malas</span>
                <p className="text-sm font-bold text-zinc-100 mt-1">{vehicle.trunkCapacityLiters} Litros</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Consumo Urbano</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">{vehicle.consumptionCity}</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Consumo Rodoviário</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">{vehicle.consumptionHighway}</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Cor Original</span>
                <p className="text-sm font-bold text-zinc-100 mt-1">{vehicle.color}</p>
              </div>
              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Final da Placa</span>
                <p className="text-sm font-bold text-zinc-100 mt-1">Final {vehicle.plateEnd}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Features */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
              {vehicle.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#141414] border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-sm text-zinc-200">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Finance Simulator */}
          {activeTab === 'finance' && (
            <div className="bg-[#141414] p-6 rounded-[28px] border border-zinc-800 space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    Simulação Personalizada
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Ajuste os valores para visualizar a parcela estimada
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Parcela Estimada</span>
                  <span className="text-2xl sm:text-3xl font-black text-red-500">
                    {installmentsCount}x de {formatBRL(calculatedMonthly)}
                  </span>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-400 font-medium">Entrada ({downPaymentPercent}%):</span>
                    <span className="text-white font-bold">{formatBRL(downPaymentAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                    <span>10% mín</span>
                    <span>80% máx</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-2">
                    Número de Parcelas
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[24, 36, 48, 60].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setInstallmentsCount(num)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          installmentsCount === num
                            ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary table */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Valor do Carro</span>
                  <span className="text-zinc-200 font-bold">{formatBRL(vehicle.price)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Valor Financiado</span>
                  <span className="text-zinc-200 font-bold">{formatBRL(loanPrincipal)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Taxa Referência</span>
                  <span className="text-emerald-400 font-bold">1,28% a.m. (Estimada)</span>
                </div>
                <button
                  onClick={() => {
                    const msg = `Olá! Gostaria de aprovar meu financiamento para o ${vehicle.brand} ${vehicle.model} com entrada de ${formatBRL(downPaymentAmount)} e ${installmentsCount}x de ${formatBRL(calculatedMonthly)}.`;
                    handleWhatsApp(msg);
                  }}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  Enviar Proposta
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Schedule Test Drive */}
          {activeTab === 'testdrive' && (
            <div className="bg-[#141414] p-6 rounded-[28px] border border-zinc-800 animate-in fade-in duration-150">
              {testDriveSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Test Drive Agendado com Sucesso!</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Nossa equipe da unidade {tdUnit} aguarda você no dia {tdDate} às {tdTime}. Enviamos a confirmação para o seu WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold text-white">
                      Agende um horário exclusivo para testar o {vehicle.brand} {vehicle.model}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Seu Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={tdName}
                        onChange={(e) => setTdName(e.target.value)}
                        placeholder="Ex: Carlos Silva"
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">WhatsApp com DDD</label>
                      <input
                        type="tel"
                        required
                        value={tdPhone}
                        onChange={(e) => setTdPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Data Preferida</label>
                      <input
                        type="date"
                        value={tdDate}
                        onChange={(e) => setTdDate(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Horário</label>
                      <select
                        value={tdTime}
                        onChange={(e) => setTdTime(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      >
                        <option value="10:00">10:00 da manhã</option>
                        <option value="11:30">11:30 da manhã</option>
                        <option value="14:00">14:00 da tarde</option>
                        <option value="16:00">16:00 da tarde</option>
                        <option value="17:30">17:30 da tarde</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Escolha a Unidade ShopCar</label>
                    <select
                      value={tdUnit}
                      onChange={(e) => setTdUnit(e.target.value)}
                      className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                    >
                      <option value="ShopCar São Paulo - Jardins (Av. Europa, 780)">ShopCar São Paulo - Jardins (Av. Europa, 780)</option>
                      <option value="ShopCar Rio de Janeiro - Barra (Av. das Américas, 4200)">ShopCar Rio de Janeiro - Barra (Av. das Américas, 4200)</option>
                      <option value="ShopCar Curitiba - Batel (Av. do Batel, 1500)">ShopCar Curitiba - Batel (Av. do Batel, 1500)</option>
                      <option value="ShopCar Brasília - Lago Sul">ShopCar Brasília - Lago Sul</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
                  >
                    Confirmar Agendamento de Test Drive
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab 5: Trade-In Valuation */}
          {activeTab === 'tradein' && (
            <div className="bg-[#141414] p-6 rounded-[28px] border border-zinc-800 animate-in fade-in duration-150">
              {tradeInSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Proposta de Troca Enviada!</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Nossa central de avaliação prévia entrará em contato via WhatsApp em até 15 minutos com a pré-avaliação do seu usado na compra deste {vehicle.model}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTradeInSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-bold text-white">
                      Dê seu seminovo como entrada na compra deste {vehicle.brand} {vehicle.model}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Qual o seu carro atual?</label>
                      <input
                        type="text"
                        required
                        value={tradeInCar}
                        onChange={(e) => setTradeInCar(e.target.value)}
                        placeholder="Ex: Jeep Renegade Longitude"
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Ano / Modelo</label>
                      <input
                        type="text"
                        required
                        value={tradeInYear}
                        onChange={(e) => setTradeInYear(e.target.value)}
                        placeholder="Ex: 2021/2022"
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Quilometragem aproximada</label>
                      <input
                        type="text"
                        value={tradeInOffer}
                        onChange={(e) => setTradeInOffer(e.target.value)}
                        placeholder="Ex: 45.000 km"
                        className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
                  >
                    Solicitar Avaliação Imediata do Meu Carro
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
