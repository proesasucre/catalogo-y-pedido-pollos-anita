import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden w-full h-[220px] sm:h-[300px] md:h-[360px] bg-black">
      {/* Fondo 1.png del banner detrás del logotipo */}
      <img
        src="/1.png"
        alt="Pollos Anita"
        className="w-full h-full object-cover object-center opacity-85"
        referrerPolicy="no-referrer"
      />

      {/* Vignette / Scrim para fundir suavemente con el fondo negro de la app */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A0A0A]" />

      {/* Único elemento: Logotipo Oficial centrado al medio del banner */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative group">
          {/* Brillo suave de calidez gastronómica */}
          <div className="absolute -inset-2.5 bg-gradient-to-r from-[#FFB300] via-[#D32F2F] to-[#FFB300] rounded-full blur-md opacity-60 group-hover:opacity-85 transition-opacity duration-500 animate-pulse" />
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-[#FFB300] bg-white shadow-2xl p-1.5 flex items-center justify-center">
            <img
              src="/assets/aistudio/logo_24c18b02.jpg"
              alt="Logotipo Oficial Pollos Anita"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
