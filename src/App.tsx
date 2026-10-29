import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { CategorySubmenu } from './components/CategorySubmenu';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { QRModal } from './components/QRModal';
import { Footer } from './components/Footer';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from './data/initialMenu';
import { CartItem, Product, ProductExtra, RestaurantSettings } from './types';
import { CheckCircle2 } from 'lucide-react';

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'pollo-brasa': '/6.png',
  'pollo-broaster': '/7.png',
  'salchipapas': '/8.png',
  'guarniciones': '/5.png',
  'bebidas': '/4.png',
  'postres-extras': '/3.png',
};

export default function App() {
  const [settings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('pollos_anita_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SETTINGS, ...parsed, phoneWhatsapp: '59172876260' };
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
    return INITIAL_SETTINGS;
  });

  const [products] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pollos_anita_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: Product) => ({
          ...p,
          image: CATEGORY_IMAGE_MAP[p.categoryId] || p.image || '/6.png',
        }));
      } catch (e) {
        console.error('Error loading products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pollos_anita_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
    return [];
  });

  // UI state: initially null so only the 6 categories are visible
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('pollos_anita_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = cartSubtotal > 0 ? (isFreeDelivery ? 0 : settings.deliveryFee) : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  // Handlers
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      setTimeout(() => {
        const el = document.getElementById('submenu-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleAddToCart = (
    product: Product,
    quantity: number,
    selectedOptions: Record<string, string>,
    selectedExtras: ProductExtra[],
    notes: string
  ) => {
    let optionsExtra = 0;
    if (product.options) {
      product.options.forEach((opt) => {
        const choice = opt.choices.find((c) => c.label === selectedOptions[opt.name]);
        if (choice && choice.extraPrice) {
          optionsExtra += choice.extraPrice;
        }
      });
    }

    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    const unitPrice = product.price + optionsExtra + extrasTotal;

    const cartId = `${product.id}-${JSON.stringify(selectedOptions)}-${selectedExtras.map((e) => e.id).sort().join(',')}-${notes}`;

    const existingIdx = cart.findIndex((item) => item.cartId === cartId);

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        cartId,
        productId: product.id,
        name: product.name,
        basePrice: product.price,
        price: unitPrice,
        quantity,
        image: product.image,
        selectedOptions,
        selectedExtras,
        notes: notes.trim() || undefined,
      };
      setCart([...cart, newItem]);
    }

    showToast(`¡"${product.name}" añadido a la canasta!`);
  };

  const handleAddToCartDirect = (product: Product) => {
    handleAddToCart(product, 1, {}, [], '');
  };

  const handleUpdateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCart(cart.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  };

  const handleRemoveItem = (cartId: string) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F4F4F5]">
      {/* 1. Header con Información de Contacto, Horario, Ubicación y Buscador */}
      <Header
        settings={settings}
        categories={CATEGORIES}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Banner Principal: Fondo actual y Logo centrado al medio (sin letras ni botones) */}
      <Hero />

      {/* 3. Menú de Categorías (6 categorías: 3 a la izquierda y 3 a la derecha) */}
      <CategoryGrid
        categories={CATEGORIES}
        products={products}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Submenú Desplegable: SOLO aparece al hacer click en una categoría o buscar */}
      <CategorySubmenu
        categories={CATEGORIES}
        products={products}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        settings={settings}
        searchQuery={searchQuery}
        onAddToCartDirect={handleAddToCartDirect}
        onOpenDetails={(product) => setSelectedProductForDetail(product)}
      />

      {/* 5. Carrito Flotante Permanente con Canastillo */}
      <FloatingCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        settings={settings}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modales Interactivos */}
      <ProductDetailModal
        product={selectedProductForDetail}
        settings={settings}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenQR={() => setIsQROpen(true)}
      />

      <QRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        amount={cartTotal}
        settings={settings}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 z-50 bg-[#141416] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-zinc-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#FFB300] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer del Catálogo en Negro */}
      <Footer settings={settings} />
    </div>
  );
}
