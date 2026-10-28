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
  // Separate into 3 on the left column (1, 2, 3) and 3 on the right column (4, 5, 6)
  const leftCategories = categories.filter((c) => c.column === 'left').sort((a, b) => a.order - b.order);
  const rightCategories = categories.filter((c) => c.column === 'right').sort((a, b) => a.order - b.order);

  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId && p.isAvailable).length;
  };

  const renderCategoryCard = (cat: Category) => {
    const isSelected = selectedCategoryId === cat.id;
    const count = getProductCount(cat.id);

    return (
      <div
        key={cat.id}
        onClick={() => onSelectCategory(cat.id)}
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border text-left bg-[#141416] hover:bg-[#1A1A1E] shadow-lg ${
          isSelected
            ? 'ring-2 ring-[#D32F2F] border-[#D32F2F] shadow-red-950/40 translate-y-[-2px]'
            : 'border-zinc-800/90 hover:border-[#FFB300] hover:translate-y-[-2px]'
        }`}
      >
        <div className="flex flex-col sm:flex-row h-full">
          {/* Fotografía Fotorrealista de Alta Calidad (Sin badges de 'más vendido, etc.') */}
          <div className="relative w-full sm:w-44 md:w-52 h-36 sm:h-auto shrink-0 overflow-hidden bg-zinc-900">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent sm:hidden" />
          </div>

          {/* Información y Título de la Categoría */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-end mb-1.5">
                {/* Conteo de platillos (Sin 'Categoría 1,2,3,etc.') */}
                <span className="text-xs text-zinc-400 font-semibold bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-700/50">
                  {count} platillos
                </span>
              </div>

              {/* Título de la Categoría */}
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFB300] transition-colors font-brand leading-snug">
                {cat.name}
              </h3>

              <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed hidden sm:block">
                {cat.description}
              </p>
            </div>

            {/* Indicador visual o flecha interactiva para desplegar el submenú */}
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#D32F2F] group-hover:text-red-400 group-hover:underline flex items-center gap-1 transition-colors">
                {isSelected ? (
                  <>
                    <span>Viendo Submenú</span>
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  </>
                ) : (
                  <>
                    <span>Desplegar Submenú</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#D32F2F] text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-300 group-hover:bg-[#D32F2F] group-hover:text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

      {/* CUADRÍCULA DE 2 COLUMNAS / 3 CATEGORÍAS A LA IZQUIERDA Y 3 A LA DERECHA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Columna Izquierda: 3 Categorías */}
        <div className="space-y-4 sm:space-y-5">
          {leftCategories.map(renderCategoryCard)}
        </div>

        {/* Columna Derecha: 3 Categorías */}
        <div className="space-y-4 sm:space-y-5">
          {rightCategories.map(renderCategoryCard)}
        </div>
      </div>
    </section>
  );
};
