import React from 'react';
import { Plus, Flame, Sparkles } from 'lucide-react';
import { Product, RestaurantSettings } from '../types';

interface ProductCardProps {
  product: Product;
  settings: RestaurantSettings;
  onAddToCartDirect: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onAddToCartDirect,
  onOpenDetails,
  categoryName,
}) => {
  const hasOptions = (product.options && product.options.length > 0) || (product.extras && product.extras.length > 0);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOptions) {
      onOpenDetails(product);
    } else {
      onAddToCartDirect(product);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative bg-[#141416] hover:bg-[#1A1A1E] rounded-2xl border border-zinc-800/90 hover:border-[#FFB300] hover:shadow-xl hover:shadow-black/60 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer h-full"
    >
      {/* Fotografía fotorrealista del platillo */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />

        {/* Badges de producto */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-[#D32F2F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          )}
          {product.isPopular && !product.badge && (
            <span className="bg-[#FFB300] text-[#0A0A0A] text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 fill-[#0A0A0A]" />
              Popular
            </span>
          )}
        </div>

        {/* Badge de Disponibilidad si está agotado */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
              Agotado por hoy
            </span>
          </div>
        )}
      </div>

      {/* Contenido del Plato */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nombre del plato */}
          <h4 className="text-base font-bold text-white group-hover:text-[#FFB300] transition-colors font-brand leading-snug line-clamp-1">
            {product.name}
          </h4>

          {/* Descripción */}
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Acompañamientos destacados */}
          <div className="mt-2.5 p-2 bg-zinc-900/90 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 font-medium">
            <span className="font-bold text-[#FFB300]">Incluye: </span>
            {product.accompaniments}
          </div>
        </div>

        {/* Footer de la tarjeta con precio destacado en Amarillo Dorado y Botón Rojo */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-zinc-400">
                {settings.currencySymbol}
              </span>
              {/* Precio destacado en Amarillo Dorado / Ámbar */}
              <span className="text-xl sm:text-2xl font-black text-[#FFB300] tabular-nums font-brand">
                {product.price.toFixed(2)}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-zinc-500 line-through tabular-nums block -mt-0.5">
                {settings.currencySymbol} {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Botón "+" o "Añadir al Pedido" en Rojo Fuego */}
          <button
            type="button"
            disabled={!product.isAvailable}
            onClick={handleAction}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
              !product.isAvailable
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-[#D32F2F] hover:bg-[#C62828] text-white hover:shadow-red-950/50'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">
              {hasOptions ? 'Personalizar' : 'Añadir'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
