import React from 'react';
import { MapPin, Phone, Clock, Heart, ShieldCheck, Truck } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface FooterProps {
  settings: RestaurantSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-[#050505] text-zinc-400 pt-12 pb-24 sm:pb-16 border-t border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Marca e Historia */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/logo_transparent.png"
                  alt="Pollos Anita"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-white font-brand">
                  Pollos Anita
                </span>
                <p className="text-xs text-[#FFB300] font-semibold">
                  El Sabor Tradicional del Pollo a la Brasa
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              Más de 15 años deleitando a las familias con pollos a la brasa asados a leña y carbón vegetal, acompañados de papas fritas seleccionadas y nuestras cremas caseras con receta secreta.
            </p>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#FFB300]" /> Envíos Rápidos
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Higiene Garantizada
              </span>
            </div>
          </div>

          {/* Contacto & Pedidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-brand">
              Atención y Pedidos
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFB300] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <a
                href="https://wa.me/59172876260"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-[#FFB300] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FFB300] shrink-0" />
                <span className="font-semibold">Envíos: +591 72876260</span>
              </a>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFB300] shrink-0" />
                <span>Horario: {settings.hours}</span>
              </p>
            </div>
          </div>

          {/* Zonas de Cobertura */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-brand">
              Servicio Delivery
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Llevamos tu pedido caliente y bien sellado. Aceptamos efectivo, transferencias bancarias y código QR al momento de la entrega.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-zinc-900 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Pollos Anita. Todos los derechos reservados.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Hecho con tradición pollera</span>
            <Heart className="w-3.5 h-3.5 text-[#D32F2F] fill-[#D32F2F]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
