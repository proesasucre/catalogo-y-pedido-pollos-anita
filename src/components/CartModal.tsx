import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Send,
  Copy,
  Check,
  MapPin,
  User,
  Phone,
  Compass,
  Banknote,
  QrCode,
  CreditCard,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CartItem, OrderForm, RestaurantSettings } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: RestaurantSettings;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onOpenQR: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenQR,
}) => {
  const [formData, setFormData] = useState<OrderForm>({
    customerName: '',
    phone: '',
    address: '',
    reference: '',
    paymentMethod: 'efectivo',
    cashAmountNeeded: '',
    orderNotes: '',
  });

  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : settings.deliveryFee) : 0;
  const grandTotal = subtotal + deliveryFee;

  const generateOrderMessage = () => {
    let msg = `🍗 *¡HOLA POLLOS ANITA! DESEO REALIZAR UN PEDIDO:* \n\n`;
    msg += `👤 *Cliente:* ${formData.customerName.trim() || 'No especificado'}\n`;
    msg += `📱 *Teléfono:* ${formData.phone.trim() || 'No especificado'}\n`;
    msg += `📍 *Dirección de Entrega:* ${formData.address.trim() || 'No especificada'}\n`;
    if (formData.reference.trim()) {
      msg += `🧭 *Referencia:* ${formData.reference.trim()}\n`;
    }

    let paymentLabel = 'Efectivo';
    if (formData.paymentMethod === 'qr') paymentLabel = 'Pago por QR / Transferencia';
    if (formData.paymentMethod === 'tarjeta') paymentLabel = 'Tarjeta (POS en domicilio)';
    if (formData.paymentMethod === 'efectivo' && formData.cashAmountNeeded.trim()) {
      paymentLabel += ` (Paga con: ${settings.currencySymbol} ${formData.cashAmountNeeded.trim()})`;
    }
    msg += `💳 *Método de Pago:* ${paymentLabel}\n\n`;

    msg += `🛒 *DETALLE DEL PEDIDO:*\n`;
    cart.forEach((item, idx) => {
      msg += `\n*${idx + 1}. ${item.quantity}x ${item.name}* — ${settings.currencySymbol} ${(item.price * item.quantity).toFixed(2)}\n`;

      const optionsKeys = Object.keys(item.selectedOptions);
      if (optionsKeys.length > 0) {
        optionsKeys.forEach((key) => {
          msg += `   • ${key}: ${item.selectedOptions[key]}\n`;
        });
      }

      if (item.selectedExtras.length > 0) {
        msg += `   • Extras: ${item.selectedExtras.map((e) => `${e.name} (+${settings.currencySymbol} ${e.price})`).join(', ')}\n`;
      }

      if (item.notes) {
        msg += `   • Nota: ${item.notes}\n`;
      }
    });

    if (formData.orderNotes.trim()) {
      msg += `\n📝 *Instrucciones Adicionales:* ${formData.orderNotes.trim()}\n`;
    }

    msg += `\n--------------------------------\n`;
    msg += `Subtotal: ${settings.currencySymbol} ${subtotal.toFixed(2)}\n`;
    msg += `Costo de Envío: ${isFreeDelivery ? 'GRATIS' : `${settings.currencySymbol} ${deliveryFee.toFixed(2)}`}\n`;
    msg += `💰 *TOTAL A PAGAR: ${settings.currencySymbol} ${grandTotal.toFixed(2)}*\n\n`;
    msg += `¡Quedo atento a la confirmación de mi pedido! Muchas gracias.`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    if (!formData.customerName.trim()) {
      setValidationError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.address.trim()) {
      setValidationError('Por favor ingresa tu dirección exacta de entrega.');
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError('Por favor ingresa tu número de teléfono.');
      return;
    }

    setValidationError('');
    const message = generateOrderMessage();
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.phoneWhatsapp}?text=${encoded}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    const message = generateOrderMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-[#141416] text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Carrito */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#0D0D0E]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/50 text-[#D32F2F] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-red-400 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-brand">
                Tu Carrito de Pedido
              </h3>
              <p className="text-xs text-zinc-400">
                Pollos Anita · Entrega directa en tu hogar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-zinc-400 hover:text-red-400 transition-colors px-2 py-1"
                title="Vaciar todo el carrito"
              >
                Vaciar
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-[#D32F2F] flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8 text-red-500 stroke-[2.2]" />
              </div>
              <h4 className="text-base font-bold text-zinc-200 font-brand">
                Tu carrito está vacío
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                Selecciona una de las 6 categorías del menú para comenzar tu pedido.
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-[#D32F2F] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#C62828] transition-colors"
              >
                Ver las 6 Categorías
              </button>
            </div>
          ) : (
            <>
              {/* Progreso de Envío Gratis */}
              <div className="bg-zinc-900/90 rounded-2xl p-3.5 border border-zinc-800">
                {isFreeDelivery ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-4 h-4 text-[#FFB300] shrink-0" />
                    <span>¡Felicidades! Tienes ENVÍO GRATIS en este pedido 🎉</span>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-300">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span>Envío gratis a partir de {settings.currencySymbol} {settings.freeDeliveryThreshold.toFixed(2)}</span>
                      <span className="text-[#FFB300]">Faltan {settings.currencySymbol} {(settings.freeDeliveryThreshold - subtotal).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#D32F2F] h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de Platos en el Carrito */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Platos seleccionados ({cart.length})
                </h4>

                <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/60">
                  {cart.map((item) => (
                    <div key={item.cartId} className="p-3.5 sm:p-4 flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover shrink-0 border border-zinc-800"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white font-brand truncate">
                            {item.name}
                          </h5>
                          <span className="text-xs sm:text-sm font-black text-[#FFB300] tabular-nums shrink-0">
                            {settings.currencySymbol} {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Opciones y extras seleccionados */}
                        <div className="text-[11px] text-zinc-400 mt-0.5 space-y-0.5">
                          {Object.entries(item.selectedOptions).map(([key, val]) => (
                            <div key={key} className="truncate">
                              <span className="font-semibold text-zinc-300">{key}:</span> {val}
                            </div>
                          ))}
                          {item.selectedExtras.length > 0 && (
                            <div className="text-amber-300 truncate">
                              <span className="font-semibold">Extras:</span>{' '}
                              {item.selectedExtras.map((e) => e.name).join(', ')}
                            </div>
                          )}
                          {item.notes && (
                            <div className="italic text-zinc-500 truncate">
                              "{item.notes}"
                            </div>
                          )}
                        </div>

                        {/* Controles de Cantidad y Eliminar */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
                          <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700/60">
                            <button
                              onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:bg-zinc-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:bg-zinc-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.cartId)}
                            className="text-zinc-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Quitar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario de Entrega a Domicilio */}
              <div className="space-y-4 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D32F2F]" />
                    <span>Datos para el Delivery</span>
                  </h4>
                  <span className="text-[11px] text-zinc-500">Campos obligatorios *</span>
                </div>

                {validationError && (
                  <div className="p-3 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej: Carlos Mendoza"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
                      />
                      <User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      Teléfono WhatsApp *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Ej: 71234567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
                      />
                      <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                    Dirección Exacta de Entrega *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Calle, número de casa/edificio, piso o dpto."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                    Referencias de Ubicación
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ej: Portón café al frente de la farmacia, rejas negras"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
                      }
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
                    />
                    <Compass className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1.5">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'efectivo' })}
                      className={`p-2.5 rounded-xl border text-center text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                        formData.paymentMethod === 'efectivo'
                          ? 'border-[#D32F2F] bg-red-950/60 text-white font-bold shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-[#FFB300]" />
                      <span>Efectivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'qr' })}
                      className={`p-2.5 rounded-xl border text-center text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                        formData.paymentMethod === 'qr'
                          ? 'border-[#D32F2F] bg-red-950/60 text-white font-bold shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#FFB300]" />
                      <span>QR / Transf.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'tarjeta' })}
                      className={`p-2.5 rounded-xl border text-center text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                        formData.paymentMethod === 'tarjeta'
                          ? 'border-[#D32F2F] bg-red-950/60 text-white font-bold shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#FFB300]" />
                      <span>Tarjeta (POS)</span>
                    </button>
                  </div>

                  {formData.paymentMethod === 'efectivo' && (
                    <div className="mt-2.5">
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        ¿Con qué billete pagarás? (Para llevarte el cambio exacto):
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Pago con Bs. 100 / Justo"
                        value={formData.cashAmountNeeded}
                        onChange={(e) =>
                          setFormData({ ...formData, cashAmountNeeded: e.target.value })
                        }
                        className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
                      />
                    </div>
                  )}

                  {formData.paymentMethod === 'qr' && (
                    <div className="mt-2.5 p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <div className="text-xs text-zinc-300">
                        <span className="font-bold text-[#FFB300]">Pago QR Simple:</span> Transfiere al momento
                      </div>
                      <button
                        type="button"
                        onClick={onOpenQR}
                        className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Ver Código QR
                      </button>
                    </div>
                  )}
                </div>

                {/* Notas generales */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                    Instrucciones Adicionales (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Llamar al llegar por favor..."
                    value={formData.orderNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNotes: e.target.value })
                    }
                    className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-hidden focus:border-[#D32F2F] text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Vista previa opcional del mensaje generado */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{showPreview ? 'Ocultar' : 'Ver'} comanda formateada para WhatsApp</span>
                </button>

                {showPreview && (
                  <div className="mt-2 p-3 bg-black text-emerald-400 font-mono text-[11px] rounded-xl whitespace-pre-wrap overflow-x-auto max-h-40 border border-zinc-800">
                    {generateOrderMessage()}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer del Carrito con Totales */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#0D0D0E] border-t border-zinc-800">
            {/* Desglose de Precios */}
            <div className="space-y-1.5 mb-4 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} productos):</span>
                <span className="tabular-nums font-semibold text-white">
                  {settings.currencySymbol} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Costo de Delivery:</span>
                <span className="tabular-nums font-semibold">
                  {isFreeDelivery ? (
                    <span className="text-emerald-400 font-bold uppercase">Gratis</span>
                  ) : (
                    `${settings.currencySymbol} ${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800 font-brand">
                <span>Total a Pagar:</span>
                <span className="text-[#FFB300] text-xl tabular-nums">
                  {settings.currencySymbol} {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botones Principales de Checkout */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="order-2 sm:order-1 flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Copiar Comanda</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="order-1 sm:order-2 flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black py-3.5 px-5 rounded-xl text-sm sm:text-base shadow-lg hover:shadow-emerald-950/40 active:scale-98 transition-all"
              >
                <Send className="w-5 h-5 fill-white" />
                <span>Enviar Pedido por WhatsApp</span>
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              Se abrirá WhatsApp directamente con tu pedido preparado para confirmación instantánea.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
