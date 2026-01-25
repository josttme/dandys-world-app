import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useCharacterFilters } from "@/hooks/useCharacterFilters";
import { CharacterFilters } from "./CharacterFilters";
import CharacterCard from "./CharacterCard";

// ==========================================
// 1. COMPONENTE SKELETON (Estado de Carga)
// ==========================================
// Este componente simula visualmente una tarjeta mientras cargamos.
// Evita el parpadeo de contenido incorrecto.
const CharacterCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4">
    <div className="mb-3 h-20 w-20 animate-pulse rounded-xl bg-slate-700/50" />
    <div className="h-4 w-24 animate-pulse rounded bg-slate-700/50" />
  </div>
);

// ==========================================
// CUSTOM HOOK: SCROLL RESTORATION
// ==========================================
// Extraemos la lógica compleja de scroll para no ensuciar el componente principal
const useScrollPersist = (storageKey: string, activeId: string) => {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0); // RAM (Desktop instantáneo)

  // 1. Guardar Scroll al moverse
  const handleScroll = () => {
    if (listRef.current) {
      const pos = listRef.current.scrollTop;
      scrollPosRef.current = pos;
      sessionStorage.setItem(storageKey, pos.toString());
    }
  };

  // 2. Restaurar al montar (Móvil / Refresh)
  useLayoutEffect(() => {
    const savedPos = sessionStorage.getItem(storageKey);
    if (savedPos && listRef.current) {
      const pos = parseInt(savedPos, 10);
      if (pos > 0) listRef.current.scrollTop = pos;
    }
  }, []);

  // 3. Estabilizar al cambiar selección (Desktop)
  useLayoutEffect(() => {
    if (listRef.current && scrollPosRef.current > 0) {
      listRef.current.scrollTop = scrollPosRef.current;
    }
  }, [activeId]);

  return { listRef, handleScroll };
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

interface CharacterListProps {
  initialId?: string;
  filterByType?: string; // "toon" | "twisted"
}

const CharacterList = ({
  initialId = "",
  filterByType = "toon",
}: CharacterListProps) => {
  // 1. CONTROLADOR DE LÓGICA (Nuestro hook refactorizado)
  // Nota: El hook ya se encarga de cargar los datos internamente via getToons()
  const controller = useCharacterFilters();

  // Pequeño hack: Como el hook trae TODOS los toons, filtramos por 'type' aquí
  // o idealmente, le enseñamos al hook a filtrar por type.
  // Por ahora, lo haremos aquí para no romper la arquitectura del hook genérico.
  const displayToons = controller.toons.filter((t) => t.type === filterByType);

  // 2. ESTADO DE SELECCIÓN ACTIVA
  const [activeId, setActiveId] = useState(initialId);

  // Listener para actualizar la selección al navegar
  useEffect(() => {
    const updateActiveId = () => {
      // Extraemos el ID de la URL de forma segura
      const parts = window.location.pathname.split("/");
      const currentId = parts.pop() || ""; // Obtiene el último segmento
      setActiveId(currentId);
    };

    // Inicializar al montar
    updateActiveId();
    document.addEventListener("astro:page-load", updateActiveId);
    window.addEventListener("popstate", updateActiveId);

    return () => {
      document.removeEventListener("astro:page-load", updateActiveId);
      window.removeEventListener("popstate", updateActiveId);
    };
  }, []);

  // 3. SCROLL RESTORATION (Encapsulado)
  const { listRef, handleScroll } = useScrollPersist(
    `scroll-pos-${filterByType}`,
    activeId
  );

  return (
    <div className="flex h-full flex-col">
      {/* HEADER FILTROS */}
      <div className="flex-none px-1 pt-1">
        <CharacterFilters controller={controller} />
      </div>

      {/* LISTA SCROLLEABLE */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto px-1 pb-20"
        // Tip: custom-scrollbar es una clase útil si la tienes en CSS global
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5">
          {/* 🔥 LÓGICA DE CARGA INTELIGENTE (LA SOLUCIÓN) */}
          {controller.isLoading ? (
            // ESTADO A: CARGANDO (Mostramos 10 esqueletos)
            // Esto le da tiempo a React para leer la URL y aplicar filtros
            // ANTES de mostrar ningún personaje real incorrecto.
            Array.from({ length: 10 }).map((_, i) => (
              <CharacterCardSkeleton key={i} />
            ))
          ) : displayToons.length > 0 ? (
            // ESTADO B: DATOS LISTOS (Renderizamos lo correcto)
            displayToons.map((toon) => (
              <CharacterCard
                key={toon.id}
                character={toon}
                isActive={toon.id === activeId}
                currentParams={controller.queryString}
              />
            ))
          ) : (
            // ESTADO C: VACÍO (Sin resultados)
            <div className="col-span-full py-10 text-center text-slate-500">
              <p>No se encontraron personajes.</p>
              <button
                onClick={controller.resetFilters}
                className="mt-2 text-yellow-500 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterList;
