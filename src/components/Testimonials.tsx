import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/cars';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-[#0c0c0c] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 block mb-2">
              Histórias de Sucesso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              O que nossos clientes dizem
            </h2>
          </div>

          {/* Google Review Badge */}
          <div className="flex items-center gap-3 bg-[#141414] p-3.5 rounded-2xl border border-zinc-800 self-start md:self-auto">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white mt-1">4.9 / 5.0 no Google Reviews</span>
              <span className="text-[10px] text-zinc-400">+1.480 clientes satisfeitos</span>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#141414] p-6 rounded-[24px] border border-zinc-800/80 flex flex-col justify-between space-y-4 hover:border-red-600/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-zinc-700" />
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    {t.name}
                    {t.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </h4>
                  <p className="text-[11px] text-red-500 font-semibold">{t.role}</p>
                  <p className="text-[10px] text-zinc-500">{t.city} • {t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
