import { useState } from "react";
import characters from "@data/characters.json";
import Heart from "./icons/Heart.jsx";
import BrokenHeart from "./icons/BrokenHeart.jsx";

// Componente reutilizable para los botones del sidebar
const SidebarButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`transition-all duration-300 ${
      isActive ? "scale-110 opacity-100" : "opacity-50 hover:opacity-80"
    }`}
  >
    <div
      className={`rounded-xl p-2 ${
        isActive ? "border-2 border-white bg-[#333]" : ""
      }`}
    >
      {children}
    </div>
  </button>
);

// Componente para la Tarjeta del Personaje (Card)
const CharacterCard = ({ char, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`relative inset-0 flex cursor-pointer flex-col justify-center rounded-3xl border-8 pb-2 transition-transform duration-200 hover:scale-105 ${
      isSelected
        ? "border-green-400 bg-black/20"
        : "border-black hover:border-white"
    } `}
  >
    <img
      src={char.avatar_img}
      className="m-2 aspect-square rounded-2xl bg-black/60 object-cover"
      alt={char.name}
    />
    <span className="absolute -bottom-2 w-full text-center text-xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:text-2xl">
      <span className="rounded-lg">{char.name}</span>
    </span>
  </button>
);

/* --- 2. COMPONENTE PRINCIPAL --- */

export default function CharacterGallery() {
  const [filter, setFilter] = useState("toon");
  const visibleCharacters = characters.filter((char) => char.type === filter);
  const [selectedChar, setSelectedChar] = useState(visibleCharacters[0]);

  // Funciones manejadoras (Handlers) para limpiar el JSX
  const handleSelectFilter = (newFilter) => {
    setFilter(newFilter);
    setSelectedChar(null); // Reseteamos selección al cambiar filtro
  };

  return (
    <div className="flex h-full w-full">
      {/* SECCIÓN A: BARRA LATERAL */}
      <div className="z-20 flex w-20 shrink-0 flex-col items-center gap-6 py-6">
        <SidebarButton
          isActive={filter === "toon"}
          onClick={() => handleSelectFilter("toon")}
        >
          <Heart size={40} />
        </SidebarButton>

        <SidebarButton
          isActive={filter === "twisted"}
          onClick={() => handleSelectFilter("twisted")}
        >
          <BrokenHeart size={40} />
        </SidebarButton>
      </div>

      {/* SECCIÓN B: ÁREA DE CONTENIDO (Fondo Rayado) */}
      <div className="relative flex flex-1 overflow-hidden rounded-2xl bg-[#414141] bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.1)_6%,rgba(0,0,0,0.1)_10%,transparent_10%,transparent_15%)]">
        {/* B.1 GRID DE CARTAS */}
        <div
          className={`scrollbar-hidden w-2/3 overflow-y-auto p-6 transition-all duration-500 ease-in-out`}
        >
          <div className="relative grid gap-6 rounded-xl bg-black/30 pt-4 lg:grid-cols-5">
            {visibleCharacters.map((char) => (
              <CharacterCard
                key={char.id}
                char={char}
                isSelected={selectedChar?.id === char.id}
                onClick={() => setSelectedChar(char)}
              />
            ))}
          </div>
        </div>

        {/* B.2 PANEL DE DETALLES */}
        {selectedChar && (
          <div className="scrollbar-thin scrollbar-thumb-yellow-400/50 scrollbar-track-transparent relative w-full overflow-y-auto border-l border-white/10 p-6 text-white">
            <div className="min-h-full w-full rounded-2xl bg-black/50 p-6">
              <div className="flex flex-col items-center">
                {/* --- CABECERA DEL PERSONAJE --- */}
                <div className="mb-4 rounded-2xl shadow-2xl shadow-purple-500/10">
                  <img
                    src={selectedChar.avatar_img}
                    className="aspect-square w-40 rounded-2xl border-4 border-black bg-black/60 object-cover"
                    alt={selectedChar.name}
                  />
                </div>

                <h2 className="mb-2 text-center text-4xl font-black tracking-wider uppercase drop-shadow-md">
                  {selectedChar.name}
                </h2>

                <span
                  className={`mb-8 transform rounded-full border-2 border-black px-6 py-1 font-bold text-black uppercase shadow-lg transition-transform hover:scale-105 ${
                    selectedChar.type === "twisted"
                      ? "bg-purple-400"
                      : "bg-yellow-400"
                  } `}
                >
                  {selectedChar.category}
                </span>

                {/* --- SECCIONES DE GALERÍA (Refactorizado) --- */}
                <div className="w-full space-y-8">
                  {/* 1. SECCIÓN SKINS */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 text-xl font-bold text-slate-300">
                      🎭 Skins Disponibles
                    </h3>
                    {/* Usamos flex-wrap para que bajen automáticamente si no caben */}
                    <div className="flex flex-wrap justify-center gap-4">
                      {selectedChar.skins.map((skin) => (
                        <div
                          key={skin.id}
                          className="group flex flex-col items-center"
                        >
                          <div className="aspect-9/15 w-24 overflow-hidden rounded-xl border-2 border-transparent bg-black/40 transition-colors group-hover:border-green-400">
                            <img
                              src={
                                skin.preview_img ||
                                "https://placehold.co/100?text=?"
                              } // Fallback si no hay imagen
                              className="h-full w-full object-cover"
                              alt={skin.name}
                            />
                          </div>
                          <span className="mt-1 text-sm text-slate-400 group-hover:text-green-400">
                            {skin.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. SECCIÓN CRAFTS 2D (Con validación) */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 text-xl font-bold text-slate-300">
                      ✂️ Manualidades 2D
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {selectedChar.skins.map((skin) =>
                        // Validamos: Solo mostramos si existe 'crafts' y 'paper_2d'
                        skin.crafts?.paper_2d ? (
                          <div
                            key={skin.id + "_2d"}
                            className="group flex flex-col items-center"
                          >
                            <div className="aspect-10/16 w-24 overflow-hidden rounded-xl border-2 border-transparent bg-black/40 transition-colors group-hover:border-green-400">
                              <img
                                src={skin.crafts.paper_2d}
                                className="h-full w-full object-cover"
                                alt={`2D ${skin.name}`}
                              />
                            </div>
                            {/* Badge pequeño para saber qué skin es */}
                            <span className="mt-1 text-sm text-slate-400 group-hover:text-green-400">
                              {skin.name}
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* 3. SECCIÓN CRAFTS 3D */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 text-xl font-bold text-slate-300">
                      📦 Modelos 3D Paper
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {selectedChar.skins.map((skin) =>
                        // Validamos si existe paper_3d
                        skin.crafts?.paper_3d ? (
                          <div
                            key={skin.id + "_3d"}
                            className="group flex flex-col items-center"
                          >
                            <div className="aspect-10/16 w-24 overflow-hidden rounded-xl border-2 border-transparent bg-black/40 transition-colors group-hover:border-green-400">
                              <img
                                src={skin.crafts.paper_3d}
                                className="h-full w-full object-cover"
                                alt={`3D ${skin.name}`}
                              />
                            </div>
                            <span className="mt-1 text-sm text-slate-400 group-hover:text-green-400">
                              {skin.name}
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
