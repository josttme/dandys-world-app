import { useState } from "react";
import { Heart, X, ArrowLeft } from "lucide-react";
import Sidebar from "./sidebar/Sidebar.jsx";
import CharacterList from "./character-list/CharacterList";

const GallerySection = ({ title, items, imageKey, onImageClick }) => (
  <div className="animate-in slide-in-from-bottom-4 mb-8 duration-500">
    <h3 className="mb-6 flex items-center gap-2 border-b-2 border-white/10 pb-3 text-2xl font-bold text-slate-300">
      {title}
    </h3>
    <div className="flex flex-wrap justify-start gap-6">
      {/* Flex-wrap para llenar el espacio grande */}
      {items.map((item, idx) => {
        let imgSrc = item.preview_img;
        if (imageKey === "paper_2d") imgSrc = item.crafts?.paper_2d;
        if (imageKey === "paper_3d") imgSrc = item.crafts?.paper_3d;

        if (!imgSrc) return null;

        return (
          <button
            key={`${item.id}-${idx}`}
            onClick={() => onImageClick(imgSrc)}
            className="group flex w-32 flex-col items-center gap-3"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-4 border-transparent bg-black/40 shadow-lg transition-all group-hover:border-green-400">
              <img
                src={imgSrc}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={item.name}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-white/10" />
            </div>
            <span className="text-center text-xs leading-tight font-black text-slate-400 uppercase transition-colors group-hover:text-green-400">
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default function DandyApp() {
  const [filter, setFilter] = useState("toon");

  // Seleccionamos el primero por defecto para que la UI no se vea vacía en PC
  // O null si prefieres pantalla de bienvenida
  const [selectedChar, setSelectedChar] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleFilterChange = (type) => {
    setFilter(type);
    setSelectedChar(null);
    setZoomedImage(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#414141] bg-[repeating-linear-gradient(-70deg,rgba(0,0,0,0.1)_0px,rgba(0,0,0,0.1)_50px,transparent_50px,transparent_100px)] text-white">
      {/* 1. SIDEBAR */}
      <Sidebar filter={filter} onFilterChange={handleFilterChange} />

      {/* SECCIÓN 2: LISTA DE PERSONAJES */}
      <CharacterList
        filter={filter}
        selectedChar={selectedChar}
        onSelectChar={setSelectedChar}
      />

      {/* =================================================
          3. SECCIÓN INFO (Derecha)
          - MÓVIL: Se pone encima de todo (fixed inset-0).
          - DESKTOP: Ocupa el espacio restante (flex-1).
            Como la sección 2 es 40%, esta será aprox 60% siempre.
      ================================================= */}
      <main
        className={`/* Lógica MÓVIL: Pantalla completa superpuesta */ relative flex overflow-hidden ${selectedChar ? "fixed inset-0 z-50 flex" : "hidden md:flex"} /* Lógica DESKTOP: Flex 1 llena el hueco que sobra */ md:static md:flex-1 lg:w-full`}
      >
        {selectedChar ? (
          <div className="scrollbar-hidden h-full w-full overflow-y-auto p-8 lg:p-12">
            {/* Header Móvil */}
            <button
              onClick={() => setSelectedChar(null)}
              className="mb-6 flex items-center gap-2 text-white/70 md:hidden"
            >
              <ArrowLeft /> Volver
            </button>

            {/* Cabecera Gigante */}
            <div className="mb-12 flex flex-col items-end gap-8 border-b border-white/10 pb-8 md:flex-row">
              <div
                className="group relative shrink-0"
                onClick={() => setZoomedImage(selectedChar.avatar_img)}
              >
                <img
                  src={selectedChar.avatar_img}
                  className="aspect-square w-48 cursor-pointer rounded-3xl border-4 border-black bg-[#222] object-cover shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:w-64"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span
                  className={`self-start rounded-full border-2 border-black px-4 py-1 text-sm font-bold text-black uppercase ${
                    selectedChar.type === "twisted"
                      ? "bg-purple-400"
                      : "bg-yellow-400"
                  } `}
                >
                  {selectedChar.category}
                </span>
                <h1 className="text-6xl leading-none font-black tracking-tighter text-white uppercase md:text-8xl">
                  {selectedChar.name}
                </h1>
                <p className="max-w-2xl text-lg text-white/60">
                  Información y descripción del personaje iría aquí. Dandy's
                  World es un juego donde...
                </p>
              </div>
            </div>

            {/* Galerías */}
            <div className="space-y-12">
              <GallerySection
                title="🎭 Skins Coleccionables"
                items={selectedChar.skins}
                onImageClick={setZoomedImage}
              />

              <GallerySection
                title="✂️ Recortables 2D"
                items={selectedChar.skins.filter((s) => s.crafts?.paper_2d)}
                imageKey="paper_2d"
                onImageClick={setZoomedImage}
              />

              <GallerySection
                title="📦 Papercraft 3D"
                items={selectedChar.skins.filter((s) => s.crafts?.paper_3d)}
                imageKey="paper_3d"
                onImageClick={setZoomedImage}
              />
            </div>

            <div className="h-32"></div>
          </div>
        ) : (
          // Estado Vacío (Empty State) para PC
          <div className="flex h-full flex-col items-center justify-center text-white/20 select-none">
            <Heart size={120} strokeWidth={1} className="mb-4 animate-pulse" />
            <p className="text-2xl font-black tracking-widest uppercase">
              Selecciona un Toon
            </p>
          </div>
        )}
      </main>
      {zoomedImage && (
        <div
          className="animate-in fade-in absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md duration-300"
          onClick={() => setZoomedImage(null)}
        >
          <button className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:text-red-500">
            <X size={32} />
          </button>
          <img
            src={zoomedImage}
            className="h-auto max-h-full w-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            alt="Zoom"
          />
          <p className="mt-6 animate-pulse text-sm font-bold tracking-widest text-white/40 uppercase">
            Click para cerrar
          </p>
        </div>
      )}
    </div>
  );
}
