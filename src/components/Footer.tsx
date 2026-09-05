import React from 'react';
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  Youtube, 
  ShieldCheck 
} from 'lucide-react';
import { createWhatsAppLink } from '../utils';

interface FooterProps {
  onNavigateToCatalog: () => void;
  onOpenFinancingModal: () => void;
  onOpenSellModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToCatalog,
  onOpenFinancingModal,
  onOpenSellModal,
}) => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-900 text-zinc-400 text-xs">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 p-0.5 flex items-center justify-center shadow-lg shadow-red-600/20">
                <div className="w-full h-full bg-[#0a0a0a] rounded-[10px] flex items-center justify-center">
                  <Car className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <span className="text-2xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                SHOP<span className="text-red-500">CAR</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              A ShopCar é referência nacional na comercialização de veículos novos e seminovos com 
              perícia cautelar 100% aprovada, garantia estendida e o melhor atendimento do Brasil.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                aria-label="Instagram da ShopCar"
                className="p-2.5 rounded-xl bg-[#141414] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#facebook" 
                aria-label="Facebook da ShopCar"
                className="p-2.5 rounded-xl bg-[#141414] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#youtube" 
                aria-label="Canal do YouTube da ShopCar"
                className="p-2.5 rounded-xl bg-[#141414] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onNavigateToCatalog} className="hover:text-red-500 transition-colors cursor-pointer">
                  Estoque de Veículos
                </button>
              </li>
              <li>
                <button onClick={onOpenFinancingModal} className="hover:text-red-500 transition-colors cursor-pointer">
                  Simulação de Financiamento
                </button>
              </li>
              <li>
                <button onClick={onOpenSellModal} className="hover:text-red-500 transition-colors cursor-pointer">
                  Vender Meu Carro
                </button>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-red-500 transition-colors">
                  Garantia & Laudo Cautelar
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-red-500 transition-colors">
                  Avaliações de Clientes
                </a>
              </li>
            </ul>
          </div>

          {/* Showrooms Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Nossas Unidades</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>São Paulo:</strong> Av. Europa, 780 - Jardins</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Rio de Janeiro:</strong> Av. das Américas, 4200 - Barra</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Curitiba:</strong> Av. do Batel, 1500 - Batel</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Brasília:</strong> SHIS QI 05 - Lago Sul</span>
              </li>
            </ul>
          </div>

          {/* Opening hours & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Atendimento</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Segunda a Sexta: 08h às 19h</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Sábados: 09h às 17h</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <a 
                  href={createWhatsAppLink('Olá! Gostaria de falar com o atendimento da ShopCar.')} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-zinc-200 hover:text-red-500 hover:underline transition-colors"
                >
                  (11) 99876-5432 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>contato@shopcarveiculos.com.br</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-zinc-900 bg-[#070707] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 ShopCar Veículos S/A. CNPJ 23.456.789/0001-90. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Ambiente Seguro e Criptografado
            </span>
            <a href="#termos" className="hover:text-zinc-300">Termos de Uso</a>
            <a href="#privacidade" className="hover:text-zinc-300">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
