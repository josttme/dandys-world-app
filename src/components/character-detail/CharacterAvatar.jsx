import React, { useMemo } from "react";
import PropTypes from "prop-types";
import GameStats from "./GameStats";

// --- Sub-components (Locales para mantener el contexto visual) ---

/**
 * 1. BackgroundEffects
 * Maneja puramente la atmósfera y el fondo. Separarlo evita ruido visual en el componente principal.
 */
const BackgroundEffects = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    {/* Vórtice central */}
    <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white/[0.02] blur-[120px]" />
    {/* Haz de luz diagonal */}
    <div className="absolute top-1/2 left-1/2 h-[800px] w-[300px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent blur-3xl" />
  </div>
);

/**
 * 2. CharacterVisuals
 * Contiene la lógica compleja de la imagen: sombras, perspectiva, glow y marcos de UI.
 */
const CharacterVisuals = ({ imageSrc, charName }) => {
  return (
    <div className="group perspective-1000 relative aspect-[9/16] w-full max-w-[320px] md:max-w-[400px]">
      {/* Backglow interactivo */}
      <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-100" />

      <div className="relative flex h-full w-full items-end justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-rotate-1">
        {/* Sombra proyectada (Decorativa) */}
        <img
          src={imageSrc}
          alt=""
          role="presentation"
          className="absolute h-full w-full translate-x-4 translate-y-4 object-contain object-bottom opacity-30 blur-2xl brightness-0 transition-transform group-hover:translate-x-8 group-hover:translate-y-8"
        />

        {/* Imagen Principal */}
        <img
          src={imageSrc}
          alt={`Ilustración de ${charName}`}
          className="relative z-20 h-full w-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          style={{ filter: "contrast(1.1) brightness(1.05)" }}
          loading="lazy"
        />

        {/* Overlay de UI "Cámara/Tecnológico" */}
        <div className="pointer-events-none absolute inset-0 z-30 m-4 border border-white/5 opacity-80">
          <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-white/20" />
          <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-white/20" />
          <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white/20" />
          <div className="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-white/20" />
        </div>
      </div>
    </div>
  );
};

CharacterVisuals.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  charName: PropTypes.string.isRequired,
};

/**
 * 3. CharacterInfo
 * Maneja la tipografía, títulos y el renderizado de las estadísticas.
 */
const CharacterInfo = ({ char }) => (
  <div className="relative z-40 flex max-w-md flex-col gap-6 text-white">
    <header className="relative">
      {/* Elemento decorativo de fondo (Skill) */}
      <span
        className="absolute -top-10 -left-2 text-8xl font-black tracking-tighter uppercase italic opacity-[0.03] select-none"
        aria-hidden="true"
      >
        {char.mainSkill || "Dandy"}
      </span>

      {/* Nombre Principal */}
      <h1 className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-8xl font-black tracking-tighter text-transparent uppercase italic drop-shadow-lg">
        {char.name}
      </h1>

      {/* Subtítulo y Separador */}
      <div className="mt-2 flex items-center gap-4">
        <span className="skew-x-[-12deg] rounded-sm bg-white/5 px-3 py-1 text-xl font-bold text-white">
          {char.category}
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/40 to-transparent" />
      </div>
    </header>

    {/* Contenedor de Stats */}
    <div className="group/stats relative isolate">
      <div className="absolute inset-0 -z-10 -skew-x-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-colors group-hover/stats:bg-white/[0.05]" />
      <div className="relative space-y-6 p-8">
        <GameStats char={char} />
      </div>
    </div>
  </div>
);

CharacterInfo.propTypes = {
  char: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    mainSkill: PropTypes.string,
  }).isRequired,
};

// --- Main Component ---

const DandyPremiumAvatar = ({ char }) => {
  // Lógica de defensa: Si no hay char, no renderizamos nada o mostramos un fallback.
  if (!char) return null;

  // Memoizamos la imagen para evitar cálculos en re-renders innecesarios
  const activeImage = useMemo(() => {
    return char.images?.full || char.avatar || "";
  }, [char.images, char.avatar]);

  return (
    <section
      className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-12 overflow-visible px-6 py-20 select-none md:flex-row"
      aria-label={`Perfil detallado de ${char.name}`}
    >
      <BackgroundEffects />

      {/* El orden en el DOM es importante para la accesibilidad y el stacking context */}
      <CharacterVisuals imageSrc={activeImage} charName={char.name} />

      <CharacterInfo char={char} />
    </section>
  );
};

DandyPremiumAvatar.propTypes = {
  char: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    images: PropTypes.shape({
      full: PropTypes.string,
    }),
    category: PropTypes.string,
    mainSkill: PropTypes.string,
  }).isRequired,
};

export default DandyPremiumAvatar;
