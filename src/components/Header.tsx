import { Phone, MapPin, Clock, ShoppingCart, Search } from 'lucide-react';
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
      {/* 1. Encabezado Superior: Información Oficial y Horarios */}
      <div className="bg-[#050505] text-zinc-300 text-xs py-2 px-4 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Ubicación y Atención */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-[#FFB300] shrink-0" />
              <span className="font-medium text-white">{settings.address}</span>
            </span>

            <span className="hidden sm:inline text-zinc-700">|</span>

            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-[#FFB300] shrink-0" />
              <span>Atención: {settings.hours}</span>
            </span>
          </div>

          <a
            href={`https://wa.me/${settings.phoneWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#FFB300] hover:text-amber-300 font-bold transition-colors text-[11px] sm:text-xs ml-auto"
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-[#FFB300]" />
            <span>Envíos: +591 72876260</span>
          </a>
        </div>
      </div>

      {/* 2. Barra de Navegación Principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y Nombre del Negocio */}
          <div
            onClick={() => {
              onSelectCategory(null);
              onSearchChange('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#FFB300] shadow-md group-hover:scale-105 transition-transform bg-white p-0.5">
              <img
                src="/assets/aistudio/logo_24c18b02.jpg"
                alt="Pollos Anita Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#D32F2F] font-brand">
                Pollos Anita
              </span>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Tradición, crocancia y sabor a la brasa
              </p>
            </div>
          </div>

          {/* Barra de búsqueda interactiva */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar plato, combo o bebida..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#18181B] border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 transition-all text-white placeholder:text-zinc-500"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Botón Carrito de Compras con Carrito de Compras */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 bg-[#D32F2F] hover:bg-[#C62828] text-white px-3.5 sm:px-4 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-red-950/40 transition-all active:scale-95 border border-red-500/30"
            >
              <div className="relative">
                {/* Carrito de compras */}
                <ShoppingCart className="w-5 h-5 text-white stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFB300] text-[#0A0A0A] font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-sm">
                {cartCount === 0 ? 'Ver Carrito' : `${settings.currencySymbol} ${cartTotal.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>

        {/* Input de búsqueda en móvil */}
        <div className="mt-2.5 sm:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar plato, combo o bebida..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#18181B] border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
