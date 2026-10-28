import React from 'react';
import { X, QrCode, ShieldCheck } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  settings: RestaurantSettings;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  amount,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-[#141416] text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-zinc-800 text-center p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 bg-amber-500/20 text-[#FFB300] border border-[#FFB300]/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white font-brand">
          Código QR de Pago Rápido
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Escanea desde tu app bancaria o billetera móvil
        </p>

        {/* Monto sugerido */}
        <div className="mt-3 py-2 px-3 bg-zinc-900 rounded-xl border border-zinc-800 inline-block">
          <span className="text-xs text-zinc-400 font-semibold">Total a transferir: </span>
          <span className="text-base font-black text-[#FFB300] font-brand tabular-nums">
            {settings.currencySymbol} {amount.toFixed(2)}
          </span>
        </div>

        {/* Representación visual de Código QR */}
        <div className="my-5 p-4 bg-white rounded-2xl shadow-inner inline-block">
          <svg
            className="w-48 h-48 mx-auto"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" fill="white" />
            <rect x="5" y="5" width="26" height="26" rx="4" fill="#0A0A0A" />
            <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
            <rect x="13" y="13" width="10" height="10" rx="2" fill="#D32F2F" />

            <rect x="69" y="5" width="26" height="26" rx="4" fill="#0A0A0A" />
            <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
            <rect x="77" y="13" width="10" height="10" rx="2" fill="#D32F2F" />

            <rect x="5" y="69" width="26" height="26" rx="4" fill="#0A0A0A" />
            <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
            <rect x="13" y="77" width="10" height="10" rx="2" fill="#D32F2F" />

            <circle cx="42" cy="12" r="3" fill="#0A0A0A" />
            <circle cx="54" cy="12" r="3" fill="#0A0A0A" />
            <circle cx="48" cy="20" r="3" fill="#FFB300" />
            <circle cx="38" cy="28" r="3" fill="#0A0A0A" />
            <circle cx="58" cy="28" r="3" fill="#0A0A0A" />

            <circle cx="12" cy="42" r="3" fill="#0A0A0A" />
            <circle cx="20" cy="48" r="3" fill="#FFB300" />
            <circle cx="28" cy="38" r="3" fill="#0A0A0A" />

            <circle cx="40" cy="40" r="4" fill="#D32F2F" />
            <circle cx="50" cy="50" r="5" fill="#0A0A0A" />
            <circle cx="60" cy="40" r="4" fill="#FFB300" />
            <circle cx="40" cy="60" r="3" fill="#0A0A0A" />
            <circle cx="60" cy="60" r="4" fill="#D32F2F" />

            <circle cx="78" cy="45" r="3" fill="#0A0A0A" />
            <circle cx="88" cy="52" r="3" fill="#0A0A0A" />
            <circle cx="45" cy="78" r="3" fill="#0A0A0A" />
            <circle cx="52" cy="88" r="3" fill="#0A0A0A" />
            <circle cx="75" cy="75" r="4" fill="#FFB300" />
            <circle cx="85" cy="85" r="4" fill="#0A0A0A" />
          </svg>
          <div className="text-[11px] font-bold text-gray-800 mt-1">
            Cuenta: POLLOS ANITA S.R.L.
          </div>
        </div>

        <div className="bg-zinc-900 text-zinc-300 text-[11px] p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2 text-left mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Envía el comprobante de pago al enviar tu pedido por WhatsApp.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#D32F2F] hover:bg-[#C62828] text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
        >
          Entendido, volver a mi pedido
        </button>
      </div>
    </div>
  );
};
