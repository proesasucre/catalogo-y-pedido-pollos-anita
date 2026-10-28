import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Category, Product, RestaurantSettings } from '../types';
import { ProductCard } from './ProductCard';

interface CategorySubmenuProps {
  categories: Category[];
  products: Product[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  settings: RestaurantSettings;
  searchQuery: string;
  onAddToCartDirect: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export const CategorySubmenu: React.FC<CategorySubmenuProps> = ({
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
  settings,
  searchQuery,
  onAddToCartDirect,
  onOpenDetails,
}) => {
  const isSearching = searchQuery.trim().length > 0;

  // El submenú solo aparece al hacer clic en una categoría o al buscar
  if (!selectedCategoryId && !isSearching) {
    return null;
  }

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  const filteredProducts = products.filter((prod) => {
    if (isSearching) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchAcc = prod.accompaniments.toLowerCase().includes(q);
      return matchName || matchDesc || matchAcc;
    }

    if (selectedCategoryId) {
      return prod.categoryId === selectedCategoryId;
    }

    return true;
  });

  return (
    <section id="submenu-section" className="py-6 sm:py-10 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Encabezado del Submenú Limpio */}
      <div className="bg-[#141416] rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Botón: "volver a menú principal" */}
        <button
          onClick={() => {
            onSelectCategory(null);
            setTimeout(() => {
              const el = document.getElementById('menu-categorias');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="w-fit px-4 py-2 rounded-xl bg-zinc-800 hover:bg-[#D32F2F] text-zinc-200 hover:text-white flex items-center gap-2 text-xs font-bold transition-all shadow-md border border-zinc-700/60 group"
          title="Volver a menú principal"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>volver a menú principal</span>
        </button>

        {/* Título correspondiente del submenú */}
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-brand">
          {isSearching
            ? `Búsqueda: "${searchQuery}"`
            : currentCategory
            ? currentCategory.name
            : 'MENÚ PRINCIPAL'}
        </h2>
      </div>

      {/* Continúan solo los botones de submenús (tarjetas de platillos) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#141416] rounded-2xl p-12 text-center border border-zinc-800 max-w-md mx-auto">
          <p className="text-base font-bold text-zinc-200 font-brand">
            No encontramos platos que coincidan
          </p>
          <button
            onClick={() => onSelectCategory(null)}
            className="mt-4 bg-[#D32F2F] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            volver a menú principal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onAddToCartDirect={onAddToCartDirect}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
};
