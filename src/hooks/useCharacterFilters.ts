import { useState, useMemo, useEffect } from "react";
import type { Toon, ToonCategory, SortField, ToonStats } from "@/types";

export interface FilterState {
  search: string;
  categories: ToonCategory[];
  activeAbilityOnly: boolean;
}

const INITIAL_FILTERS: FilterState = {
  search: "",
  categories: [],
  activeAbilityOnly: false,
};

// Helper puro para parsear (sin lógica de window aquí para evitar errores SSR)
const parseParams = (searchParams: URLSearchParams) => {
  const search = searchParams.get("q") || "";
  const active = searchParams.get("active") === "true";

  const catParam = searchParams.get("cat");
  const categories = catParam
    ? catParam
        .split(",")
        .filter(Boolean)
        .map((c) => c.trim().toLowerCase() as ToonCategory)
    : [];

  const sort = (searchParams.get("sort") as SortField) || "name";
  // Si explícitamente es 'desc', es false. Sino (null, 'asc', etc) es true.
  const asc = searchParams.get("dir") !== "desc";

  return {
    filters: { search, categories, activeAbilityOnly: active },
    sort,
    asc,
  };
};

export const useCharacterFilters = (toons: Toon[]) => {
  // 1. ESTADO INICIAL "SEGURO"
  // Inicializamos con valores por defecto para que coincida con el servidor (SSR)
  // y evitar errores de hidratación visual (botones grises vs azules).
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortField>("name");
  const [isAscending, setIsAscending] = useState(true);

  // Flag para saber si ya estamos en el cliente
  const [isMounted, setIsMounted] = useState(false);

  // 2. EFECTO DE MONTAJE (Hydration Fix) [Diagram of React Hydration process]
  // Este efecto corre SOLO una vez en el cliente tras el primer render.
  // Lee la URL y actualiza el estado, forzando a React a pintar los botones azules.
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const parsed = parseParams(params);

      setFilters(parsed.filters);
      setSortOrder(parsed.sort);
      setIsAscending(parsed.asc);
    }
  }, []); // Array vacío = Solo al montar

  // 3. GENERAR QUERY STRING
  const currentQueryString = useMemo(() => {
    // Si no estamos montados, no generamos query string para evitar sobrescribir URL prematuramente
    if (!isMounted) return "";

    const params = new URLSearchParams();

    if (filters.search) params.set("q", filters.search);
    if (filters.activeAbilityOnly) params.set("active", "true");
    if (filters.categories.length > 0) {
      params.set("cat", filters.categories.join(","));
    }

    params.set("sort", sortOrder);
    params.set("dir", isAscending ? "asc" : "desc");

    return params.toString();
  }, [filters, sortOrder, isAscending, isMounted]);

  // 4. SINCRONIZAR URL (State -> URL)
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    // Leemos la URL actual del navegador para comparar
    const currentSearch = window.location.search.replace(/^\?/, "");

    // Si la URL generada es diferente a la del navegador, la actualizamos.
    // Esto evita bucles infinitos.
    if (currentSearch !== currentQueryString) {
      const newUrl = currentQueryString
        ? `${window.location.pathname}?${currentQueryString}`
        : window.location.pathname;

      window.history.replaceState(null, "", newUrl);
    }
  }, [currentQueryString, isMounted]);

  // 5. LÓGICA DE FILTRADO
  const filteredAndSortedToons = useMemo(() => {
    let result = [...toons];

    // Fuzzy Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    // Categories
    if (filters.categories.length > 0) {
      result = result.filter((t) => filters.categories.includes(t.category));
    }
    // Active Ability
    if (filters.activeAbilityOnly) {
      result = result.filter((t) => t.hasActiveAbility);
    }

    // Sorting
    result.sort((a, b) => {
      const getValue = (item: Toon, field: SortField) => {
        if (field === "name" || field === "releaseDate") return item[field];
        return item.stats[field as keyof ToonStats] || 0;
      };

      const valA = getValue(a, sortOrder);
      const valB = getValue(b, sortOrder);

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      const comparison = valA > valB ? 1 : -1;
      return isAscending ? comparison : -comparison;
    });

    return result;
  }, [toons, filters, sortOrder, isAscending]);

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setSortOrder("name");
    setIsAscending(true);
  };

  const toggleSortDirection = () => setIsAscending(!isAscending);

  return {
    toons: filteredAndSortedToons,
    filters,
    queryString: currentQueryString,
    sortOrder,
    isAscending,
    setFilters,
    setSortOrder,
    toggleSortDirection,
    handleReset,
    isMounted, // Exportamos esto por si quieres mostrar un loading spinner
  };
};
