import React, { useState } from 'react';
import {
  X,
  Settings,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Product, Category, RestaurantSettings } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RestaurantSettings;
  onUpdateSettings: (newSettings: RestaurantSettings) => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefaults: () => void;
  categories: Category[];
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetToDefaults,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'settings' | 'new-dish'>('dishes');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [tempSettings, setTempSettings] = useState<RestaurantSettings>(settings);
  const [saveToast, setSaveToast] = useState(false);

  const [newDish, setNewDish] = useState<Partial<Product>>({
    name: '',
    categoryId: 'pollo-brasa',
    price: 35,
    description: '',
    accompaniments: 'Papas fritas + Ensalada + Salsas',
    image: '/src/assets/images/cat_pollo_brasa_1793213901696.jpg',
    isAvailable: true,
  });

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;

    const created: Product = {
      id: `prod-custom-${Date.now()}`,
      categoryId: newDish.categoryId || 'pollo-brasa',
      name: newDish.name,
      description: newDish.description || '',
      price: Number(newDish.price),
      image: newDish.image || '/src/assets/images/cat_pollo_brasa_1793213901696.jpg',
      isAvailable: true,
      accompaniments: newDish.accompaniments || 'Acompañamiento clásico',
    };

    onAddProduct(created);
    setNewDish({
      name: '',
      categoryId: 'pollo-brasa',
      price: 35,
      description: '',
      accompaniments: 'Papas fritas + Ensalada + Salsas',
      image: '/src/assets/images/cat_pollo_brasa_1793213901696.jpg',
      isAvailable: true,
    });
    setActiveTab('dishes');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const filteredProducts =
    selectedFilterCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedFilterCategory);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-[#141416] text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Panel */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#0D0D0E]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D32F2F] text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-brand">
                Panel Administrativo Pollos Anita
              </h3>
              <p className="text-[11px] text-zinc-400">
                Gestiona precios, insumos, fotos y datos de contacto en vivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'dishes'
                ? 'bg-[#141416] border-[#D32F2F] text-white shadow-xs'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Gestión de Platos ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('new-dish')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'new-dish'
                ? 'bg-[#141416] border-[#D32F2F] text-white shadow-xs'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            + Agregar Plato
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'settings'
                ? 'bg-[#141416] border-[#D32F2F] text-white shadow-xs'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Configuración Local
          </button>
        </div>

        {/* Cuerpo del Panel */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: GESTIÓN DE PLATOS Y PRECIOS */}
          {activeTab === 'dishes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <button
                    onClick={() => setSelectedFilterCategory('all')}
                    className={`px-2.5 py-1 rounded-lg ${
                      selectedFilterCategory === 'all'
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedFilterCategory(c.id)}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${
                        selectedFilterCategory === c.id
                          ? 'bg-[#D32F2F] text-white'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {c.shortTitle}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onResetToDefaults}
                  className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1"
                  title="Restaurar precios y platos iniciales de fábrica"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar menú original</span>
                </button>
              </div>

              {/* Lista editable de platos */}
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-zinc-800/40"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                            {prod.name}
                          </h5>
                          {!prod.isAvailable && (
                            <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 font-bold px-1.5 py-0.5 rounded">
                              Agotado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate max-w-sm">
                          {prod.accompaniments}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
                      {/* Input de Precio */}
                      <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-xl">
                        <span className="text-xs font-bold text-[#FFB300]">
                          {settings.currencySymbol}
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          value={prod.price}
                          onChange={(e) =>
                            onUpdateProduct({
                              ...prod,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-16 text-xs font-black text-[#FFB300] bg-transparent focus:outline-hidden text-right tabular-nums"
                        />
                      </div>

                      {/* Botón Disponibilidad */}
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateProduct({
                            ...prod,
                            isAvailable: !prod.isAvailable,
                          })
                        }
                        className={`text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors ${
                          prod.isAvailable
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                            : 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900'
                        }`}
                      >
                        {prod.isAvailable ? 'Disponible' : 'Agotado'}
                      </button>

                      {prod.id.startsWith('prod-custom-') && (
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(prod.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AGREGAR NUEVO PLATO */}
          {activeTab === 'new-dish' && (
            <form onSubmit={handleCreateDish} className="space-y-4 max-w-lg mx-auto">
              <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                Crear Nuevo Platillo para el Menú
              </h4>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Nombre del Plato *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cuarto Broaster Especial con Chicha"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={newDish.categoryId}
                    onChange={(e) =>
                      setNewDish({ ...newDish, categoryId: e.target.value })
                    }
                    className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Precio ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newDish.price}
                    onChange={(e) =>
                      setNewDish({ ...newDish, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Descripción Corta
                </label>
                <textarea
                  rows={2}
                  placeholder="Descripción apetitosa..."
                  value={newDish.description}
                  onChange={(e) =>
                    setNewDish({ ...newDish, description: e.target.value })
                  }
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Acompañamientos / Qué Incluye
                </label>
                <input
                  type="text"
                  placeholder="Ej: Papas fritas + Ensalada + 3 salsas"
                  value={newDish.accompaniments}
                  onChange={(e) =>
                    setNewDish({ ...newDish, accompaniments: e.target.value })
                  }
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Foto de Categoría Representativa
                </label>
                <select
                  value={newDish.image}
                  onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                >
                  <option value="/src/assets/images/cat_pollo_brasa_1793213901696.jpg">
                    Pollo a la Brasa
                  </option>
                  <option value="/src/assets/images/cat_pollo_broaster_1793213902729.jpg">
                    Pollo Broaster
                  </option>
                  <option value="/src/assets/images/cat_salchipapas_1793213903520.jpg">
                    Salchipapas y Piqueos
                  </option>
                  <option value="/src/assets/images/cat_guarniciones_1793213904354.jpg">
                    Guarniciones y Ensaladas
                  </option>
                  <option value="/src/assets/images/cat_bebidas_1793213905492.jpg">
                    Bebidas y Chicha
                  </option>
                  <option value="/src/assets/images/cat_postres_extras_1793213905082.jpg">
                    Postres y Salsas
                  </option>
                  <option value="/src/assets/images/hero_polleria_banner_1793213901178.jpg">
                    Banquete Completo
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar y Publicar en Menú</span>
              </button>
            </form>
          )}

          {/* TAB 3: CONFIGURACIÓN GENERAL */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg mx-auto">
              <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                Datos del Negocio y WhatsApp
              </h4>

              <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Estado del Restaurante
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {tempSettings.isOpen ? '🟢 Abierto y recibiendo pedidos' : '🔴 Cerrado temporalmente'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTempSettings({ ...tempSettings, isOpen: !tempSettings.isOpen })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    tempSettings.isOpen
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {tempSettings.isOpen ? 'Abierto' : 'Cerrado'}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Número de WhatsApp para Pedidos
                </label>
                <input
                  type="text"
                  value={tempSettings.phoneWhatsapp}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, phoneWhatsapp: e.target.value })
                  }
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                  placeholder="59178541230"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Dirección Oficial del Local
                </label>
                <input
                  type="text"
                  value={tempSettings.address}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, address: e.target.value })
                  }
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={tempSettings.hours}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, hours: e.target.value })
                    }
                    className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Costo de Delivery Base ({tempSettings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={tempSettings.deliveryFee}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        deliveryFee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Envío Gratis a partir de ({tempSettings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={tempSettings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-[#D32F2F] focus:outline-hidden text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de Configuración</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
