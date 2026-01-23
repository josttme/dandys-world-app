import GameStats from "./GameStats";

const DandyPremiumAvatar = ({ char }) => {
  const image = char.images.full || char.avatar;

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-12 overflow-visible px-6 py-20 select-none md:flex-row">
      {/* 1. FONDO ATMOSFÉRICO (Efecto de Tunel de Luz) */}
      <div className="pointer-events-none absolute inset-0">
        {/* El "Vórtice" de Ichor */}
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white/[0.02] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[300px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent blur-3xl" />
      </div>

      {/* 2. CONTENEDOR DEL PERSONAJE (9:16 Dinámico) */}
      <div className="group perspective-1000 relative aspect-[9/16] w-full max-w-[320px] md:max-w-[400px]">
        {/* Luz trasera (Backglow) que emula el color del personaje */}
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-100" />

        {/* 3. LA SILUETA (Efecto de profundidad) */}
        <div className="relative flex h-full w-full items-end justify-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:-rotate-1">
          {/* Sombra proyectada hacia atrás */}
          <img
            src={image}
            alt=""
            className="absolute h-full w-full translate-x-4 translate-y-4 object-contain object-bottom opacity-30 blur-2xl brightness-0 transition-transform group-hover:translate-x-8 group-hover:translate-y-8"
          />

          {/* PERSONAJE PRINCIPAL */}
          <img
            src={image}
            alt={char.name}
            className="relative z-20 h-full w-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            style={{
              // Filtro sutil de "grano de película" aplicado solo al personaje
              filter: "contrast(1.1) brightness(1.05)",
            }}
          />

          {/* 4. ELEMENTOS DE UI DE ESCENARIO */}
          {/* Líneas de enfoque Estilo "Cámara de Seguridad" o "Show de TV" */}
          <div className="pointer-events-none absolute inset-0 z-30 m-4 border-[1px] border-white/5">
            <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-white/20" />
            <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-white/20" />
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white/20" />
            <div className="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-white/20" />
          </div>
        </div>
      </div>

      {/* 5. BLOQUE DE INFORMACIÓN (Brutalismo Toon) */}
      <div className="relative z-40 flex max-w-md flex-col gap-6 text-white">
        <header className="relative">
          {/* Texto de fondo "Glitch" */}
          <span className="absolute -top-10 -left-2 text-8xl font-black tracking-tighter uppercase italic opacity-[0.03]">
            {char.mainSkill || "Dandy"}
          </span>

          <h1 className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-8xl font-black tracking-tighter text-transparent uppercase italic drop-shadow-lg">
            {char.name}
          </h1>

          <div className="mt-2 flex items-center gap-4">
            <span className="skew-x-[-12deg] px-3 py-1 text-xl font-bold text-white">
              {char.category}
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/40 to-transparent" />
          </div>
        </header>

        {/* Panel de Estadísticas (Estilo Minimalista/Industrial) */}
        <div className="group/stats relative">
          <div className="absolute inset-0 -skew-x-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-colors group-hover/stats:bg-white/[0.05]" />

          <div className="relative space-y-6 p-8">
            <GameStats char={char} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DandyPremiumAvatar;
