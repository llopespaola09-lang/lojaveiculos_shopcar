import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  ShieldAlert, 
  MessageCircle, 
  Building2,
  Database,
  Check
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatBRL, calculateInstallment, createWhatsAppLink } from '../utils';
import { saveLead } from '../lib/firebase';

interface FinancingCalculatorModalProps {
  isOpen: boolean;
  preselectedVehicle: Vehicle | null;
  onClose: () => void;
}

export const FinancingCalculatorModal: React.FC<FinancingCalculatorModalProps> = ({
  isOpen,
  preselectedVehicle,
  onClose,
}) => {
  if (!isOpen) return null;

  const [carValue, setCarValue] = useState<number>(preselectedVehicle ? preselectedVehicle.price : 189900);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(48);
  const [selectedBank, setSelectedBank] = useState<string>('Santander Auto');

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const banks = [
    { name: 'Santander Auto', rate: 1.25, badge: 'Taxa Promocional' },
    { name: 'Itaú Veículos', rate: 1.29, badge: 'Aprovação Rápida' },
    { name: 'Bradesco Financiamentos', rate: 1.28, badge: 'Correntistas' },
    { name: 'BV Financeira', rate: 1.34, badge: 'Flexível' },
  ];

  const currentBank = banks.find((b) => b.name === selectedBank) || banks[0];
  const annualRate = (Math.pow(1 + currentBank.rate / 100, 12) - 1) * 100;

  const downPaymentAmount = (carValue * downPaymentPercent) / 100;
  const principal = Math.max(0, carValue - downPaymentAmount);
  const monthlyPayment = calculateInstallment(principal, annualRate, months);
  const totalFinanced = monthlyPayment * months;
  const totalEstimatedCost = downPaymentAmount + totalFinanced;

  const handleSendProposal = async () => {
    // Save to Firebase Firestore
    try {
      await saveLead({
        type: 'financing_proposal',
        name: name || 'Cliente Web',
        phone: phone || 'Não informado',
        vehicleId: preselectedVehicle?.id || 'simulador-geral',
        vehicleName: preselectedVehicle ? `${preselectedVehicle.brand} ${preselectedVehicle.model}` : 'Veículo Geral',
        details: {
          carValue,
          downPaymentAmount,
          downPaymentPercent,
          months,
          monthlyPayment,
          bank: selectedBank,
          rateMonth: currentBank.rate,
        }
      });
      setIsSaved(true);
    } catch (err) {
      console.error('Error saving financing lead:', err);
    }

    const msg = `Olá! Realizei uma simulação de financiamento na ShopCar:
- Veículo: ${preselectedVehicle ? `${preselectedVehicle.brand} ${preselectedVehicle.model}` : 'Simulação Geral'}
- Valor: ${formatBRL(carValue)}
- Banco: ${selectedBank} (taxa ${currentBank.rate}% a.m.)
- Entrada: ${formatBRL(downPaymentAmount)} (${downPaymentPercent}%)
- Parcelamento: ${months}x de ${formatBRL(monthlyPayment)}
${name ? `- Nome: ${name}` : ''}
${phone ? `- Telefone: ${phone}` : ''}
Gostaria de submeter meus dados para análise de crédito gratuita.`;
    window.open(createWhatsAppLink(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="financing-modal-container"
        className="bg-[#0a0a0a] border border-zinc-800 rounded-[32px] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Simulador de Financiamento ShopCar
              </h2>
              <p className="text-xs text-zinc-500">
                Compare as melhores taxas dos bancos parceiros em tempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {preselectedVehicle && (
            <div className="flex items-center justify-between p-3.5 bg-[#141414] rounded-2xl border border-zinc-800 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={preselectedVehicle.images[0]}
                  alt={preselectedVehicle.model}
                  className="w-14 h-10 object-cover rounded-xl border border-zinc-800"
                />
                <div>
                  <span className="text-red-500 font-bold block">{preselectedVehicle.brand} {preselectedVehicle.model}</span>
                  <span className="text-zinc-400">{preselectedVehicle.version}</span>
                </div>
              </div>
              <span className="text-sm font-black text-white">{formatBRL(preselectedVehicle.price)}</span>
            </div>
          )}

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column Controls */}
            <div className="space-y-5 bg-[#141414] p-5 rounded-[24px] border border-zinc-800">
              {/* Vehicle Value Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center justify-between">
                  <span>Valor do Veículo</span>
                  <span className="text-red-500 font-bold">{formatBRL(carValue)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">R$</span>
                  <input
                    type="number"
                    min="30000"
                    max="1500000"
                    step="5000"
                    value={carValue}
                    onChange={(e) => setCarValue(Number(e.target.value))}
                    className="w-full bg-zinc-950 text-sm font-bold text-white pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Down payment */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400 font-medium">Entrada ({downPaymentPercent}%):</span>
                  <span className="text-emerald-400 font-bold">{formatBRL(downPaymentAmount)}</span>
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
                  <span>40% recomendada</span>
                  <span>80% máx</span>
                </div>
              </div>

              {/* Installments options */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Prazo de Financiamento
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 24, 36, 48, 60].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setMonths(term)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        months === term
                          ? 'bg-red-600 text-white border-red-500 font-black shadow-lg shadow-red-600/20'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'
                      }`}
                    >
                      {term}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Banco Parceiro Homologado</span>
                </label>
                <div className="space-y-2">
                  {banks.map((b) => (
                    <div
                      key={b.name}
                      onClick={() => setSelectedBank(b.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        selectedBank === b.name
                          ? 'bg-red-600/10 border-red-600/60 text-white'
                          : 'bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border ${selectedBank === b.name ? 'border-red-500 bg-red-600' : 'border-zinc-700'}`} />
                        <span className="font-semibold">{b.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                          {b.badge}
                        </span>
                        <span className="font-bold text-red-500">{b.rate}% a.m.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Result Card */}
            <div className="bg-[#141414] p-6 rounded-[24px] border border-zinc-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                  Resultado Estimado da Simulação
                </div>
                
                {/* Huge Installment Highlight */}
                <div className="p-4 rounded-2xl bg-red-600/10 border border-red-600/20 mb-5">
                  <span className="text-xs text-red-400 block font-semibold">Sua Parcela Mensal Fixa</span>
                  <div className="text-3xl sm:text-4xl font-black text-red-500 mt-1 font-['Space_Grotesk']">
                    {months}x de {formatBRL(monthlyPayment)}
                  </div>
                  <span className="text-[11px] text-zinc-400 block mt-1">
                    Primeira parcela com carência de até 60 dias
                  </span>
                </div>

                {/* Lead Contact Info for Bank Approval */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                    Dados para Análise Cadastral:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp (DDD + Número)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Entrada ({downPaymentPercent}%)</span>
                    <span className="text-white font-bold">{formatBRL(downPaymentAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Saldo Financiado</span>
                    <span className="text-white font-bold">{formatBRL(principal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Taxa de Juros Mensal</span>
                    <span className="text-emerald-400 font-bold">{currentBank.rate}% a.m.</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800/80">
                    <span className="text-zinc-400">Total das {months} Parcelas</span>
                    <span className="text-zinc-200 font-bold">{formatBRL(totalFinanced)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400">Custo Efetivo Total Estimado</span>
                    <span className="text-zinc-200 font-semibold">{formatBRL(totalEstimatedCost)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isSaved && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Proposta registrada no banco de dados Firebase! Redirecionando para atendimento...</span>
                  </div>
                )}

                <button
                  onClick={handleSendProposal}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar para Análise de Crédito</span>
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
                  <Database className="w-3 h-3 text-red-500" />
                  <span>Integração ativa com Firebase Firestore & Bancos Parceiros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
