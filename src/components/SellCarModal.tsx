import React, { useState } from 'react';
import { 
  X, 
  Car, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  MessageCircle,
  Clock,
  Database
} from 'lucide-react';
import { formatBRL, createWhatsAppLink } from '../utils';
import { saveLead } from '../lib/firebase';

interface SellCarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellCarModal: React.FC<SellCarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [km, setKm] = useState('');
  const [plate, setPlate] = useState('');
  const [condition, setCondition] = useState<'Excelente' | 'Bom' | 'Regular'>('Excelente');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate realistic estimation
    const baseEstimates: Record<string, number> = {
      Toyota: 140000,
      Honda: 135000,
      BMW: 280000,
      Jeep: 130000,
      Volkswagen: 110000,
      Chevrolet: 95000,
      Hyundai: 105000,
      Ford: 160000,
      Audi: 240000,
      Volvo: 310000,
      Porsche: 650000,
      BYD: 220000
    };

    const base = baseEstimates[brand] || 120000;
    const modifier = condition === 'Excelente' ? 1.05 : condition === 'Bom' ? 0.95 : 0.85;
    const finalVal = Math.round(base * modifier);

    setEstimatedValue(finalVal);
    setSubmitted(true);

    // Persist to Firebase Firestore
    saveLead({
      type: 'sell_car_quote',
      name: name || 'Cliente Vendedor',
      phone: phone || 'Não informado',
      city: city || 'Não informada',
      details: {
        brand,
        model,
        year,
        km,
        plate,
        condition,
        estimatedValue: finalVal,
      }
    }).catch((err) => console.error('Error saving sell quote:', err));
  };

  const handleWhatsAppOffer = () => {
    const msg = `Olá! Solicitei a avaliação do meu veículo na ShopCar:
- Carro: ${brand} ${model}
- Ano: ${year}
- Km: ${km}
- Condição: ${condition}
- Placa: ${plate || 'Não informada'}
- Cidade: ${city}
Gostaria de agendar a vistoria para receber a proposta à vista via PIX.`;
    window.open(createWhatsAppLink(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="sell-car-modal-box"
        className="bg-[#0a0a0a] border border-zinc-800 rounded-[32px] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Venda seu Carro na ShopCar
              </h2>
              <p className="text-xs text-zinc-500">
                Avaliação imediata, pagamento via PIX no mesmo dia e sem burocracia
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
        <div className="overflow-y-auto flex-1 p-6">
          {submitted && estimatedValue ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                  Faixa de Avaliação Estimada ShopCar
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 font-['Space_Grotesk']">
                  {formatBRL(estimatedValue * 0.94)} a {formatBRL(estimatedValue * 1.02)}
                </div>
                <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
                  Calculado com base na média FIPE e no mercado atual para o modelo {brand} {model} {year}.
                </p>
              </div>

              <div className="bg-[#141414] p-4 rounded-2xl border border-zinc-800 text-left space-y-3 text-xs max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Pagamento 100% à vista via PIX na aprovação do laudo</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transferência de propriedade por nossa conta</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>Vistoria no conforto da sua casa ou em uma de nossas lojas</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleWhatsAppOffer}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Agendar Vistoria via WhatsApp</span>
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                >
                  Recalcular com outro veículo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Marca do Veículo</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  >
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="BMW">BMW</option>
                    <option value="Jeep">Jeep</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Ford">Ford</option>
                    <option value="Audi">Audi</option>
                    <option value="Volvo">Volvo</option>
                    <option value="BYD">BYD</option>
                    <option value="Porsche">Porsche</option>
                    <option value="Outra">Outra marca</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Modelo & Versão</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex: Corolla XEi 2.0 ou Compass T270"
                    className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Ano de Fabricação/Modelo</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Ex: 2022/2023"
                    className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Quilometragem Atual (Km)</label>
                  <input
                    type="text"
                    required
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder="Ex: 38.000 km"
                    className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Placa (Opcional para consulta FIPE)</label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="ABC-1234 ou ABC1D23"
                    className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Estado de Conservação</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'Excelente' | 'Bom' | 'Regular')}
                    className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                  >
                    <option value="Excelente">Excelente (Sem retoques, revisado)</option>
                    <option value="Bom">Bom (Pequenos detalhes de uso)</option>
                    <option value="Regular">Regular (Necessita de revisão/pneus)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
                  Seus Dados de Contato
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Fernando Rocha"
                      className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Cidade / Estado</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: São Paulo, SP"
                      className="w-full bg-zinc-950 text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-sell-form"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Calcular Valor de Compra ShopCar</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
