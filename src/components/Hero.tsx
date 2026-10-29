import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden w-full h-[240px] sm:h-[320px] md:h-[380px] bg-black">
      {/* Fondo 1.png del banner detrás del logotipo */}
      <img
        src="/1.png"
        alt="Fondo Pollos Anita"
        className="w-full h-full object-cover object-center opacity-90"
        referrerPolicy="no-referrer"
      />

      {/* Scrim sutil para fundir armónicamente los bordes con el fondo negro de la app */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A0A0A]" />

      {/* Logotipo Oficial centrado, más grande, sin fondo blanco ni anillo luminoso */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <img
          src="/assets/aistudio/logo_transparent.png"
          alt="Logotipo Oficial Pollos Anita"
          className="w-44 sm:w-60 md:w-72 lg:w-80 max-h-[85%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
};
