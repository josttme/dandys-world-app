import { useState, useEffect } from "react";
import { Sparkles, Zap, Shield, Heart, Star, Palette, X } from "lucide-react";
import { getCharacterBackground } from "@utils/characterStyles";

const GameStats = ({ char }) => {
  if (!char || !char.stats) return null;

  const STAT_CONFIG = [
    { key: "health", label: "Salud", color: "bg-[#c85759]", icon: Heart },
    {
      key: "skillCheck",
      label: "Skill Check",
      color: "bg-[#c98f53]",
      icon: Star,
    },
    {
      key: "movementSpeed",
      label: "Velocidad",
      color: "bg-[#cbcb5b]",
      icon: Star,
    },
    {
      key: "stamina",
      label: "Resistencia",
      color: "bg-[#57c455]",
      icon: Star,
    },
    { key: "stealth", label: "Sigilo", color: "bg-[#598ccb]", icon: Star },
    {
      key: "extractionSpeed",
      label: "Extracción",
      color: "bg-[#824ecc]",
      icon: Star,
    },
  ];

  // Nota: He simplificado la importación de iconos para el ejemplo completo,
  // asegúrate de usar tus iconos reales de lucide-react (Heart, Star) dentro de GameStats.

  return (
    <div className="grid w-full grid-cols-2 gap-3 font-sans">
      {STAT_CONFIG.map((stat) => {
        const value = char.stats[stat.key] || 0;
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="w-full overflow-hidden rounded-lg border-2 border-black/10 bg-white/5 shadow-sm"
          >
            <div
              className={`${stat.color} flex flex-col items-center justify-center border-b-2 border-black/20 px-5 py-1`}
            >
              <span className="pb-1 text-[12px] font-black tracking-wider text-white uppercase drop-shadow-md">
                {stat.label} ({value})
              </span>
              <div className="flex h-8 w-full items-center justify-center gap-4 bg-zinc-900/50 px-2">
                {Array.from({ length: value }).map((_, i) => (
                  <Icon
                    key={i}
                    size={20}
                    className="fill-white text-white"
                    strokeWidth={0}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- 2. COMPONENTE PRINCIPAL ---

export default function CharacterDetail({ char }) {
  if (!char) return null;

  const bgStyle = getCharacterBackground(char);
  // ESTADO: Controlar qué imagen se muestra
  // Inicializamos con la imagen full o el avatar del personaje
  const [currentImage, setCurrentImage] = useState(
    char.images.full || char.avatar
  );

  // Estado para la animación de transición en Desktop
  const [isExiting, setIsExiting] = useState(false);
  // ESTADO: Modal para móviles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Efecto: Si cambia el personaje (prop char), reseteamos la imagen principal
  useEffect(() => {
    setCurrentImage(char.images.full || char.avatar);
    setIsExiting(false);
  }, [char]);

  // MANEJADOR DE CLICS EN SKINS
  const handleSkinClick = (skinImage) => {
    // Evitar recargar si es la misma imagen
    if (skinImage === currentImage) return;

    const isDesktop = window.innerWidth >= 1280;

    if (isDesktop) {
      // 1. Iniciamos salida (Slide hacia la derecha + Fade Out)
      setIsExiting(true);

      // 2. Esperamos que termine la animación de salida (150ms)
      setTimeout(() => {
        setCurrentImage(skinImage);
        // 3. Iniciamos entrada (la clase cambia autom. en el render)
        setIsExiting(false);
      }, 120); // Tiempo igual a la duración de salida CSS
    } else {
      // Móvil: Abrir modal
      setModalImage(skinImage);
      setIsModalOpen(true);
    }
  };

  // ... imports y estados ...

  // ... imports y estados ...

  return (
    <>
      {/* 1. CONTENEDOR PRINCIPAL */}
      {/* CAMBIO CLAVE: 
        - Agregamos 'h-full overflow-y-auto' para MÓVIL/TABLET. 
          Esto asegura que si el padre tiene altura fija, este componente permita scrollear su contenido.
        - Mantenemos 'xl:overflow-hidden' para DESKTOP para usar el sistema de paneles. 
    */}
      <div className="custom-scrollbar h-full w-full overflow-y-auto bg-zinc-900 p-2 text-white xl:h-[calc(100vh-1rem)] xl:overflow-hidden">
        {/* WRAPPER FLEX */}
        {/* En móvil es 'h-auto' (crece con el contenido). En Desktop es 'h-full' (se adapta al padre). */}
        <div className="flex flex-col gap-6 xl:h-full xl:flex-row">
          {/* --- COLUMNA IZQUIERDA --- */}
          {/* Móvil: h-auto (natural). Desktop: h-full + scroll interno. */}
          <div className="custom-scrollbar flex w-full shrink-0 flex-col gap-4 xl:h-full xl:w-5/12 xl:overflow-y-auto">
            {/* Tarjeta Visual */}
            <div
              className="group relative flex aspect-[3/4] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-all"
              style={bgStyle}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

              <img
                src={currentImage}
                alt={char.name}
                className={`relative z-10 h-[95%] w-full object-contain drop-shadow-2xl transition-all group-hover:scale-105 ${
                  isExiting
                    ? "translate-x-12 opacity-0 duration-150 ease-in"
                    : "translate-x-0 opacity-100 duration-300 ease-out"
                }`}
              />

              <div className="absolute top-3 left-3 z-20 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                <span className="text-xs font-bold tracking-widest text-white uppercase">
                  {char.type} - {char.category} {char.event && "-"} {char.event}
                </span>
              </div>
            </div>

            {/* Nombre */}
            <div className="shrink-0 text-center xl:text-left">
              <h1 className="mb-1 text-center text-5xl leading-none font-black tracking-tighter text-white uppercase drop-shadow-lg">
                {char.name}
              </h1>
            </div>

            {/* Descripción */}
            <section className="shrink-0 rounded-xl bg-zinc-800/20 p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                <h3 className="text-lg font-bold tracking-wider text-zinc-200 uppercase">
                  Descripción
                </h3>
              </div>
              <p className="text-md mt-1 leading-relaxed text-zinc-400">
                {char.description}
              </p>
            </section>
          </div>

          {/* --- COLUMNA DERECHA --- */}
          {/* Móvil: h-auto. Desktop: h-full + scroll interno. */}
          <div className="custom-scrollbar flex w-full flex-col gap-6 pb-4 xl:h-full xl:overflow-y-auto">
            {/* SECCIÓN 1: STATS */}
            <section className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold tracking-wider text-zinc-200 uppercase">
                  Estadísticas
                </h3>
              </div>
              <GameStats char={char} />
            </section>

            {/* SECCIÓN 2: HABILIDADES */}
            <section className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold tracking-wider text-zinc-200 uppercase">
                  Habilidades
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {char.abilities && char.abilities.length > 0 ? (
                  char.abilities.map((ability, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 rounded-lg border-zinc-700 p-3 transition-colors ${ability.type === "active" ? "border bg-zinc-900/80 hover:border-zinc-500 " : "opacity-70"}`}
                    >
                      <div
                        className={`shrink-0 rounded-md p-2 ${ability.type === "active" ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"}`}
                      >
                        {ability.type === "active" ? (
                          <Zap size={20} />
                        ) : (
                          <Shield size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white uppercase">
                            {ability.name}
                          </h4>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[10px] ${ability.type === "active" ? "border-blue-500/30 text-blue-300" : "border-purple-500/0 text-purple-300"} font-semibold uppercase`}
                          >
                            {ability.type === "active" ? "Activa" : "Pasiva"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          {ability.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 italic">
                    Sin habilidades.
                  </p>
                )}
              </div>
            </section>

            {/* SECCIÓN 3: SKINS */}
            <section className="flex-grow rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                <Palette className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold tracking-wider text-zinc-200 uppercase">
                  Skins{" "}
                  <span className="ml-1 text-xs font-normal text-zinc-500">
                    ({char.skins?.length || 0})
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3">
                {char.skins &&
                  char.skins.map((skin) => (
                    <div
                      key={skin.id}
                      className="group flex cursor-pointer flex-col gap-1"
                      onClick={() => handleSkinClick(skin.image)}
                    >
                      <div
                        className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg border-2 bg-zinc-900 transition-all ${currentImage === skin.image ? "border-yellow-400 shadow-md shadow-yellow-400/20" : "border-zinc-700 group-hover:border-yellow-400"}`}
                      >
                        <img
                          src={skin.image}
                          alt={skin.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span
                        className={`truncate text-center text-[10px] font-semibold ${currentImage === skin.image ? "text-yellow-400" : "text-zinc-400"}`}
                      >
                        {skin.name}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* MODAL MÓVIL (Sin cambios) */}
      {isModalOpen && (
        <div
          className={`animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200`}
          onClick={() => setIsModalOpen(false)}
        >
          <button className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <X size={32} />
          </button>
          <img
            src={modalImage || ""}
            alt="Skin Preview"
            className="animate-in zoom-in-95 max-h-full max-w-full rounded-lg object-contain drop-shadow-2xl duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
