import React from 'react';
import { Phone, MapPin, ShoppingCart, Search } from 'lucide-react';
import { RestaurantSettings, Category } from '../types';

interface HeaderProps {
  settings: RestaurantSettings;
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-md">
      {/* 1. Fila Superior: Logotipo Oficial de Encabezado y Nombre */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y Nombre del Negocio */}
          <div
            onClick={() => {
              onSelectCategory(null);
              onSearchChange('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/assets/aistudio/logo_transparent.png"
                alt="Pollos Anita Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#D32F2F] font-brand">
                Pollos Anita
              </span>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                Tradición, crocancia y sabor a la brasa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Contactos DEBAJO del logotipo:
          A la izquierda: Ubicación -> Teléfono de envíos (sin horario)
          A la derecha: Botón de pedidos y directamente debajo el buscador */}
      <div className="bg-[#050505] text-zinc-300 py-2.5 px-4 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Bloque Izquierdo: Ubicación y Teléfono de envíos */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 text-xs sm:text-sm">
            {/* 1. Ubicación */}
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-4 h-4 text-[#FFB300] shrink-0" />
              <span className="font-medium text-white">{settings.address}</span>
            </span>

            <span className="hidden sm:inline text-zinc-700">|</span>

            {/* 2. Teléfono de envíos */}
            <a
              href={`https://wa.me/${settings.phoneWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#FFB300] hover:text-amber-300 font-bold transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0 text-[#FFB300]" />
              <span>Envíos: +591 72876260</span>
            </a>
          </div>

          {/* Bloque Derecho: Botón de pedidos y directamente debajo el buscador */}
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            {/* Botón Ver Pedido */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 bg-[#D32F2F] hover:bg-[#C62828] text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold shadow-md hover:shadow-red-950/40 transition-all active:scale-95 border border-red-500/30 shrink-0"
              title="Ver pedido y carrito"
            >
              <div className="relative">
                <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFB300] text-[#0A0A0A] font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold">
                {cartCount === 0 ? 'Ver Pedido' : `${settings.currencySymbol} ${cartTotal.toFixed(2)}`}
              </span>
            </button>

            {/* Buscador debajo de 'Ver Pedido' */}
            <div className="relative w-full sm:w-72 md:w-80">
              <input
                type="text"
                placeholder="Buscar plato, combo o bebida..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#141416] border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]/30 text-white placeholder:text-zinc-500 shadow-inner transition-colors"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-1"
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
