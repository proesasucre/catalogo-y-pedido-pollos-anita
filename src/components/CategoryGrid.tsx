import React from 'react';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { Category, Product } from '../types';

interface CategoryGridProps {
  categories: Category[];
  products: Product[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId && p.isAvailable).length;
  };

  return (
    <section id="menu-categorias" className="py-6 sm:py-10 px-4 max-w-7xl mx-auto">
      {/* Título unificado MENÚ PRINCIPAL */}
      <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 pb-3 border-b border-zinc-800">
        <span className="w-3 h-3 rounded-full bg-[#D32F2F]" />
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-brand">
          MENÚ PRINCIPAL
        </h2>
        <span className="w-3 h-3 rounded-full bg-[#FFB300]" />
      </div>

      {/* DISPOSICIÓN: Misma cuadrícula, tamaño y estructura que los submenús */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = getProductCount(cat.id);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative bg-[#141416] hover:bg-[#1A1A1E] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full shadow-lg ${
                isSelected
                  ? 'ring-2 ring-[#FFB300] border-[#FFB300] shadow-amber-950/40 translate-y-[-2px]'
                  : 'border-zinc-800/90 hover:border-[#FFB300] hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/60'
              }`}
            >
              {/* Fotografía fotorrealista aspect-4/3 idéntica a los submenús */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Contenido de la tarjeta con misma estructura que los submenús */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Título de la Categoría */}
                  <h3 className="text-base font-bold text-white group-hover:text-[#FFB300] transition-colors font-brand leading-snug">
                    {cat.name}
                  </h3>

                  {/* Descripción de la categoría */}
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Conteo de platillos disponibles */}
                  <div className="mt-2.5 text-xs text-zinc-400 font-medium">
                    <span className="text-[#FFB300] font-bold">{count}</span> platillos disponibles
                  </div>
                </div>

                {/* Footer de la tarjeta: Despliegue de submenú en color AMARILLO (#FFB300) */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#FFB300] group-hover:underline flex items-center gap-1.5 transition-colors">
                    {isSelected ? (
                      <>
                        <span>Viendo Submenú</span>
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#FFB300]" />
                      </>
                    ) : (
                      <>
                        <span>Desplegar Submenú</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#FFB300]" />
                      </>
                    )}
                  </span>

                  {/* Botón interactivo circular en amarillo */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#FFB300] text-[#0A0A0A] shadow-md shadow-amber-500/30'
                        : 'bg-amber-500/15 text-[#FFB300] border border-[#FFB300]/30 group-hover:bg-[#FFB300] group-hover:text-[#0A0A0A]'
                    }`}
                  >
                    {isSelected ? (
                      <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
