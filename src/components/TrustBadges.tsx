import React from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Truck, 
  BadgePercent, 
  FileCheck2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const differentials = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-amber-400" />,
      title: 'Laudo Cautelar 100% Aprovado',
      description: 'Estrutura, pintura, histórico de sinistro, leilão e procedência documental rigorosamente verificados pela Supervisão.'
    },
    {
      icon: <Wrench className="w-7 h-7 text-emerald-400" />,
      title: 'Revisão Técnica de 150 Itens',
      description: 'Motor, suspensão, freios, elétrica e fluidos testados por mecânicos especialistas antes de ir para o showroom.'
    },
    {
      icon: <BadgePercent className="w-7 h-7 text-blue-400" />,
      title: 'Financiamento com Menor Taxa',
      description: 'Parceria com os principais bancos do país (Santander, Itaú, Bradesco, BV) com aprovação rápida sem sair de casa.'
    },
    {
      icon: <RotateCcw className="w-7 h-7 text-purple-400" />,
      title: 'Troca com Troco e Avaliação Justa',
      description: 'Aceitamos seu usado na troca com a melhor valorização do mercado e você ainda pode sair com dinheiro na conta.'
    },
    {
      icon: <Truck className="w-7 h-7 text-rose-400" />,
      title: 'Entrega VIP em Todo o Brasil',
      description: 'Receba seu veículo transportado com seguro total na porta da sua casa ou retire em nossas lojas conceito.'
    },
    {
      icon: <FileCheck2 className="w-7 h-7 text-teal-400" />,
      title: 'Garantia Estendida de até 2 Anos',
      description: 'Tranquilidade absoluta com cobertura mecânica de motor, câmbio e assistência 24 horas em território nacional.'
    }
  ];

  return (
    <section className="py-16 bg-[#0a0a0a] border-t border-zinc-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-xs font-bold text-red-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Padrão de Excelência ShopCar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
            Por que comprar seu carro na ShopCar?
          </h2>
          <p className="text-sm text-zinc-400">
            Eliminamos a incerteza da compra de seminovos com transparência absoluta e processo 100% seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentials.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#141414] border border-zinc-800/90 hover:border-red-600/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-['Space_Grotesk']">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
