// src/components/CharacterList.tsx
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCharacterFilters } from "@/hooks/useCharacterFilters";
import type { Toon } from "@/types"; // Asegúrate de importar Toon, no Character
import CharacterFilters from "./CharacterFilters";

import { getToons } from "@services/toonService";

import CharacterCard from "./CharacterCard";

interface CharacterListProps {
  initialId?: string;
  filterByType?: string;
  initialData?: Toon[];
}
const CharacterList = ({
  initialId = "",
  filterByType = "toon",
  initialData,
}: CharacterListProps) => {
  // --- 1. ESTADOS DE FILTROS ---
  /*   const [sortOrder, setSortOrder] = useState<SortField>("default");
  const [isAscending, setIsAscending] = useState(true);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  ); */

  // 2. CONEXIÓN CON EL HOOK (Lógica de Negocio)
  // Aquí obtenemos 'filters' del hook. Si el hook fallara, filters sería undefined.

  // 1. CORRECCIÓN DEL ERROR DE HIDRATACIÓN
  // Inicializamos DIRECTAMENTE con lo que manda el servidor.
  // Ya no usamos 'window' aquí. Así Server y Client coinciden al 100%.
  const [activeId, setActiveId] = useState(initialId);

  // --- 2. SISTEMA DE SCROLL (REFS) ---
  const listRef = useRef<HTMLDivElement>(null);
  // Memoria RAM: Para Desktop (Persist)
  const scrollPosRef = useRef<number>(0);
  // Clave única para guardar en disco: Para Móvil (Restore)
  const storageKey = `scroll-pos-${filterByType}`;

  // --- 3. LECTURA DE URL (Inits) ---
  /*   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSort = params.get("sort") as SortField;
    const urlDir = params.get("dir");
    const urlActive = params.get("activeOnly");

    if (urlSort) setSortOrder(urlSort);
    if (urlDir === "desc") setIsAscending(false);
    if (urlActive === "true") setActiveFilter(true);
  }, []);
 */
  // --- 4. ESCUCHA DE NAVEGACIÓN (Para actualizar borde verde en Desktop) ---
  // 3. LISTENERS DE NAVEGACIÓN (Para actualizar DESPUÉS del primer render)
  useEffect(() => {
    const updateActiveId = () => {
      const parts = window.location.pathname.split("/");
      // Asumimos que el ID es el último segmento
      const currentId = parts[parts.length - 1];
      setActiveId(currentId);
    };

    // Escuchar cambios de página de Astro
    document.addEventListener("astro:page-load", updateActiveId);

    // 🔥 IMPORTANTE: También sincronizar si el usuario usa las flechas del navegador (popstate)
    window.addEventListener("popstate", updateActiveId);

    return () => {
      document.removeEventListener("astro:page-load", updateActiveId);
      window.removeEventListener("popstate", updateActiveId);
    };
  }, []);

  // --- 5. OBTENCIÓN DE DATOS ---
  /*   const filteredToons = useMemo(() => {
    const allToons = getToons({
      sortBy: sortOrder,
      sortDirection: isAscending ? "asc" : "desc",
      hasActiveAbility: activeFilter,
    });
    return allToons.filter((t) => t.type === filterByType);
  }, [filterByType, sortOrder, isAscending, activeFilter]);
 */
  // --- 6. GENERACIÓN DE QUERY STRING ---
  /*   const currentQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (sortOrder !== "default") params.set("sort", sortOrder);
    if (!isAscending) params.set("dir", "desc");
    if (activeFilter) params.set("activeOnly", "true");
    const str = params.toString();
    return str ? `?${str}` : "";
  }, [sortOrder, isAscending, activeFilter]);
 */
  // --- 7. MANEJADOR DE SCROLL ---
  // Guarda en DOS lugares: RAM (para persistencia inmediata) y Disco (para recargas/móvil)
  const handleScroll = () => {
    if (listRef.current) {
      const pos = listRef.current.scrollTop;
      scrollPosRef.current = pos; // Actualizamos RAM
      sessionStorage.setItem(storageKey, pos.toString()); // Actualizamos Disco
    }
  };

  // --- 8. EFECTO A: RESTAURACIÓN (SOLO MÓVIL / PRIMER MONTAJE) ---
  // Este se ejecuta SOLO cuando el componente nace (mount).
  // En Desktop con persist, esto corre UNA sola vez y no molesta más.
  // En Móvil, corre cada vez que vuelves de la página de detalle.
  // 5. RESTAURACIÓN MÓVIL (Fix para que funcione tras arreglar hidratación)
  useLayoutEffect(() => {
    const savedPos = sessionStorage.getItem(storageKey);
    // Solo restauramos si NO hay persistencia en RAM (indicador de que es un montaje nuevo/móvil)
    // o si estamos en móvil y listRef acaba de nacer.
    if (savedPos && listRef.current) {
      const posNumber = parseInt(savedPos, 10);
      if (posNumber > 0) {
        listRef.current.scrollTop = posNumber;
      }
    }
  }, []); // Solo al montar
  // --- 9. EFECTO B: ESTABILIZACIÓN (SOLO DESKTOP / NAVEGACIÓN) ---
  // Este arregla el parpadeo en Desktop. Se ejecuta cada vez que cambia el seleccionado.
  // Ignora el sessionStorage y confía ciegamente en la RAM (scrollPosRef) que es más fresca.
  useLayoutEffect(() => {
    if (listRef.current && scrollPosRef.current > 0) {
      // "Golpeamos" el scroll para que vuelva a donde estaba en la RAM
      // por si el navegador intentó moverlo al cambiar el borde verde.
      listRef.current.scrollTop = scrollPosRef.current;
    }
  }, [activeId]); // Solo cuando cambia la selección

  // 1. OBTENCIÓN DE DATOS
  const [baseData, setBaseData] = useState<Toon[]>(initialData || []);

  useEffect(() => {
    if (!initialData) {
      // Si no vienen de Astro, los pedimos al servicio
      // Asegúrate que getToons acepte los parámetros correctamente según tu servicio
      const data = getToons({ type: filterByType });
      setBaseData(data);
    }
  }, [initialData, filterByType]);

  // 2. CONEXIÓN CON EL HOOK (Lógica de Negocio)
  // Aquí obtenemos 'filters' del hook. Si el hook fallara, filters sería undefined.
  const {
    toons: filteredToons, // Renombramos para claridad
    filters, // <--- ESTE ES EL OBJETO QUE FALTABA
    queryString,
    setFilters,
    sortOrder,
    setSortOrder,
    isAscending,
    toggleSortDirection,
    handleReset,
  } = useCharacterFilters(baseData);

  // --- RENDER ---
  return (
    <div className="flex h-full flex-col">
      <div className="flex-none">
        <CharacterFilters
          filters={filters}
          onFilterChange={setFilters}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          isAscending={isAscending}
          onDirectionToggle={toggleSortDirection}
          onReset={handleReset}
        />
      </div>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="h-full flex-1 overflow-hidden overflow-y-auto pr-2"
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredToons.map((toon) => (
            // Pasamos el objeto toon completo al componente hijo
            <CharacterCard
              key={toon.id}
              character={toon}
              isActive={toon.id === initialId} // Le decimos si está seleccionado
              currentParams={queryString}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterList;
