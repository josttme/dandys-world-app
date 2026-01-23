import GameStats from "./GameStats";
const DetailHeader = ({ char }) => {
  const isTwisted = char.type === "twisted";

  return (
    <div className="mb-16 flex flex-col items-end gap-8 border-b border-white/5 pb-10 md:flex-row">
      {/* 1. AVATAR GIGANTE INTERACTIVO */}
      <div className="group relative shrink-0">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all md:w-50">
          <img
            src={char.avatar_img}
            alt={char.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* 2. INFORMACIÓN DE TEXTO */}
      <div className="flex w-full flex-col gap-4">
        {/* Badge de Categoría */}
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-black tracking-[0.2em] uppercase ${
              isTwisted
                ? "border border-purple-500/30 bg-purple-500/20 text-purple-300"
                : "border border-yellow-400/30 bg-yellow-400/20 text-yellow-300"
            } `}
          >
            {char.category || "Common"}
          </span>
          <span className="text-xs font-bold tracking-widest text-white/20 uppercase">
            #{char.id}
          </span>
        </div>

        {/* Nombre Gigante */}
        <h1
          className="text-6xl leading-[0.9] font-black tracking-tighter text-white uppercase drop-shadow-2xl md:text-8xl"
          style={{ viewTransitionName: `name-${char.id}` }} // Magia para Astro
        >
          {char.name}
        </h1>

        {/* Aquí va el componente */}
        <div className="mt-6 mb-8 max-w-60">
          <GameStats char={char} />
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
