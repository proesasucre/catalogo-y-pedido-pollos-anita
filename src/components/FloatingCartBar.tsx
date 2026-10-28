import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface FloatingCartBarProps {
  cartCount: number;
  cartTotal: number;
  settings: RestaurantSettings;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartCount,
  cartTotal,
  settings,
  onOpenCart,
}) => {
  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full bg-[#D32F2F] hover:bg-[#C62828] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-red-500/40 transform active:scale-98 transition-all duration-200 group"
        >
          {/* Contador y Carrito de Compras */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-white stroke-[2.2]" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#FFB300] text-[#0A0A0A] font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs uppercase tracking-wider text-red-100 font-bold block">
                Ver Carrito ({cartCount} {cartCount === 1 ? 'producto' : 'productos'})
              </span>
              <span className="text-base sm:text-lg font-black font-brand text-white">
                Total: {settings.currencySymbol} {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Flecha de Acción */}
          <div className="flex items-center gap-1.5 bg-white text-[#D32F2F] font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl group-hover:bg-[#FFB300] group-hover:text-[#0A0A0A] transition-colors shadow-xs">
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};
