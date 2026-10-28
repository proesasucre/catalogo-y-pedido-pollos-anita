import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, ProductExtra, RestaurantSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  settings: RestaurantSettings;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedOptions: Record<string, string>,
    selectedExtras: ProductExtra[],
    notes: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const initialOptions: Record<string, string> = {};
  if (product.options) {
    product.options.forEach((opt) => {
      if (opt.choices.length > 0) {
        initialOptions[opt.name] = opt.choices[0].label;
      }
    });
  }

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [notes, setNotes] = useState('');

  let optionsExtra = 0;
  if (product.options) {
    product.options.forEach((opt) => {
      const selectedChoice = opt.choices.find((c) => c.label === selectedOptions[opt.name]);
      if (selectedChoice && selectedChoice.extraPrice) {
        optionsExtra += selectedChoice.extraPrice;
      }
    });
  }

  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = product.price + optionsExtra + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleExtra = (extra: ProductExtra) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleSubmit = () => {
    onAddToCart(product, quantity, selectedOptions, selectedExtras, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-[#141416] text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-800 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all shadow-md border border-zinc-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen del Plato */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-black/30 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              {product.badge && (
                <span className="bg-[#D32F2F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-brand leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
          {/* Descripción y Acompañamientos */}
          <div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-2.5 p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-200">
              <span className="font-bold text-[#FFB300]">📦 Incluye en tu pedido: </span>
              {product.accompaniments}
            </div>
          </div>

          {/* Opciones configurables */}
          {product.options &&
            product.options.map((opt) => (
              <div key={opt.name} className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    {opt.name}
                  </label>
                  {opt.required && (
                    <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800 font-bold px-1.5 py-0.5 rounded">
                      Obligatorio
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {opt.choices.map((choice) => {
                    const isChecked = selectedOptions[opt.name] === choice.label;
                    return (
                      <button
                        type="button"
                        key={choice.label}
                        onClick={() =>
                          setSelectedOptions({ ...selectedOptions, [opt.name]: choice.label })
                        }
                        className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                          isChecked
                            ? 'border-[#D32F2F] bg-red-950/40 text-white font-bold shadow-sm'
                            : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'border-[#D32F2F] bg-[#D32F2F] text-white'
                                : 'border-zinc-600'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{choice.label}</span>
                        </div>
                        {choice.extraPrice ? (
                          <span className="text-xs font-bold text-[#FFB300] ml-2 shrink-0">
                            +{settings.currencySymbol} {choice.extraPrice.toFixed(2)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Extras Opcionales */}
          {product.extras && product.extras.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                ¿Deseas agregar adicionales? (Opcional)
              </label>
              <div className="space-y-2">
                {product.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <button
                      type="button"
                      key={extra.id}
                      onClick={() => handleToggleExtra(extra)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        isChecked
                          ? 'border-[#D32F2F] bg-red-950/40 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'border-[#D32F2F] bg-[#D32F2F] text-white'
                              : 'border-zinc-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="font-bold text-[#FFB300] ml-2 shrink-0">
                        +{settings.currencySymbol} {extra.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Instrucciones Especiales */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Instrucciones Especiales para Cocina
            </label>
            <input
              type="text"
              placeholder="Ej: piel bien tostada, salsas separadas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Footer del Modal: Cantidad y CTA */}
        <div className="p-4 bg-[#0D0D0E] border-t border-zinc-800 flex items-center justify-between gap-3">
          {/* Selector de Cantidad */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-sm text-white tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Añadir en Rojo Fuego */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#C62828] text-white py-3 px-4 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-red-950/40 active:scale-98 transition-all"
          >
            <span>Añadir al Pedido</span>
            <span>•</span>
            <span className="font-black tabular-nums text-[#FFB300]">
              {settings.currencySymbol} {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
