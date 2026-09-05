import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Car, 
  Check, 
  Image as ImageIcon, 
  Database, 
  Sparkles,
  DollarSign,
  Gauge
} from 'lucide-react';
import { Vehicle, VehicleCategory, FuelType, TransmissionType } from '../types';
import { addVehicle } from '../lib/firebase';
import { formatBRL } from '../utils';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (modelName: string) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [brand, setBrand] = useState('Porsche');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [year, setYear] = useState(2024);
  const [category, setCategory] = useState<VehicleCategory>('Esportivo');
  const [price, setPrice] = useState(650000);
  const [km, setKm] = useState(12000);
  const [fuel, setFuel] = useState<FuelType>('Gasolina');
  const [transmission, setTransmission] = useState<TransmissionType>('Automático');
  const [color, setColor] = useState('Branco Carrara');
  const [plateEnd, setPlateEnd] = useState('9');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80');
  const [engine, setEngine] = useState('3.0 Boxer Bi-Turbo 450cv');
  const [powerHp, setPowerHp] = useState(450);
  const [tag, setTag] = useState('Novidade');
  const [description, setDescription] = useState('Veículo de procedência única, laudo 100% aprovado, revisado em concessionária autorizada.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) return;

    setIsSubmitting(true);
    try {
      const newCar: Omit<Vehicle, 'id'> = {
        brand,
        model: model.trim(),
        version: version.trim() || 'Edição Especial',
        yearModel: `${year}/${year}`,
        year: Number(year),
        category,
        price: Number(price),
        fipePrice: Math.round(Number(price) * 1.03),
        km: Number(km),
        fuel,
        transmission,
        color,
        plateEnd,
        city: 'São Paulo',
        state: 'SP',
        images: [
          imageUrl.trim() || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
        ],
        featured: true,
        tag: tag.trim() || undefined,
        cautelarApproved: true,
        warrantyMonths: 24,
        engine,
        powerHp: Number(powerHp),
        acceleration0to100: '4.2s',
        topSpeed: '290 km/h',
        trunkCapacityLiters: 420,
        consumptionCity: '8.5 km/l',
        consumptionHighway: '12.0 km/l',
        features: [
          'Pacote Aerodinâmico Completo',
          'Bancos Elétricos com Memória',
          'Painel Digital Interativo',
          'Câmera 360 Graus',
          'Apple CarPlay e Som Premium'
        ],
        description: description.trim(),
      };

      await addVehicle(newCar);
      setIsSubmitting(false);
      onSuccess(`${brand} ${model}`);
      onClose();
    } catch (err) {
      console.error('Error adding vehicle to Firestore:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        id="add-vehicle-modal-container"
        className="bg-[#0a0a0a] border border-zinc-800 rounded-[32px] w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/10 text-red-500 border border-red-600/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Cadastrar Novo Veículo no Estoque
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" /> Firebase Live
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                O veículo será gravado diretamente no banco de dados Firestore e aparecerá no catálogo em tempo real
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Marca</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              >
                <option value="Porsche">Porsche</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Volvo">Volvo</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="BYD">BYD</option>
                <option value="Jeep">Jeep</option>
                <option value="Ford">Ford</option>
                <option value="Volkswagen">Volkswagen</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Modelo</label>
              <input
                type="text"
                required
                placeholder="Ex: 911 Carrera GTS"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Versão Detalhada</label>
              <input
                type="text"
                placeholder="Ex: 3.0 Bi-Turbo PDK"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Ano Fabricação</label>
              <input
                type="number"
                min="2015"
                max="2026"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Esportivo">Esportivo</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Picape">Picape</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Preço (R$)</label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Quilometragem (km)</label>
              <input
                type="number"
                min="0"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Combustível</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as FuelType)}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Flex">Flex</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Elétrico">Elétrico</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Câmbio</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              >
                <option value="Automático">Automático</option>
                <option value="Dupla Embreagem">Dupla Embreagem</option>
                <option value="CVT">CVT</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Potência (cv)</label>
              <input
                type="number"
                value={powerHp}
                onChange={(e) => setPowerHp(Number(e.target.value))}
                className="w-full bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
              URL da Imagem Principal
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-[#141414] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
              />
            </div>
            {imageUrl && (
              <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-zinc-800">
                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Descrição Comercial</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#141414] border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Garantia ShopCar de 24 meses e Laudo Cautelar inclusos por padrão</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Salvando no Firebase...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvar no Estoque</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
