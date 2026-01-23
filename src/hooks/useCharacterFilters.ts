import { useState, useMemo, useEffect, useCallback } from "react";
import type {
  ToonCategory,
  SortField,
  SortDirection,
  FilterOptions,
} from "@/types";
import { getToons } from "@/services/toonService"; // <--- Importamos la lógica centralizada

// Estado interno de la UI (separado de la lógica de negocio)
export interface UseCharacterFiltersState {
  search: string;
  categories: ToonCategory[];
  activeAbilityOnly: boolean;
  sortBy: SortField;
  sortDirection: SortDirection;
}

const INITIAL_STATE: UseCharacterFiltersState = {
  search: "",
  categories: [],
  activeAbilityOnly: false,
  sortBy: "name", // Default que coincida con el servicio
  sortDirection: "asc",
};

/**
 * Helper puro para leer la URL.
 * Extrae la verdad desde el querystring del navegador.
 */
const parseUrlParams = (
  searchParams: URLSearchParams
): UseCharacterFiltersState => {
  const search = searchParams.get("q") || "";
  const active = searchParams.get("active") === "true";

  const catParam = searchParams.get("cat");
  const categories = catParam
    ? (catParam.split(",").filter(Boolean) as ToonCategory[])
    : [];

  const sort = (searchParams.get("sort") as SortField) || "name";
  const dir = (searchParams.get("dir") as SortDirection) || "asc";

  return {
    search,
    categories,
    activeAbilityOnly: active,
    sortBy: sort,
    sortDirection: dir,
  };
};

export const useCharacterFilters = () => {
  // 1. ESTADO
  const [filters, setFilters] =
    useState<UseCharacterFiltersState>(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // 2. HYDRATION (Client-side mount)
  // Leemos la URL solo una vez al montar para inicializar el estado
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlState = parseUrlParams(params);
      setFilters(urlState);
    }
  }, []);

  // 3. LOGICA DE NEGOCIO (DELEGADA AL SERVICIO)
  // Aquí ocurre la magia: No reinventamos la rueda. Usamos getToons.
  // Cada vez que cambia el estado 'filters', recalculamos la lista.
  const results = useMemo(() => {
    const options: FilterOptions = {
      searchTerm: filters.search,
      categories: filters.categories,
      hasActiveAbility: filters.activeAbilityOnly ? true : undefined, // undefined para que el servicio lo ignore si es false
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
    };

    return getToons(options);
  }, [filters]);

  // 🔥 NUEVO: Calculamos el string AQUÍ para poder devolverlo
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("q", filters.search);
    if (filters.activeAbilityOnly) params.set("active", "true");
    if (filters.categories.length > 0)
      params.set("cat", filters.categories.join(","));

    // Solo agregamos sort si no es el default
    if (filters.sortBy !== "name") params.set("sort", filters.sortBy);
    if (filters.sortDirection !== "asc")
      params.set("dir", filters.sortDirection);

    return params.toString();
  }, [filters]);

  // 4. URL SYNC (Efecto secundario)
  // Actualizamos la URL cuando cambian los filtros
  // 🔥 ACTUALIZADO: El efecto ahora usa la variable calculada arriba
  useEffect(() => {
    if (!isMounted) return;

    const currentBrowserParams = window.location.search.replace(/^\?/, "");

    if (queryString !== currentBrowserParams) {
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

      window.history.replaceState(null, "", newUrl);
    }
  }, [queryString, isMounted]); // Dependemos de queryString

  // 5. HANDLERS (Acciones explícitas)
  // En lugar de exponer un setFilters genérico, exponemos acciones claras.

  const setSearch = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
  }, []);

  const toggleCategory = useCallback((category: ToonCategory) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      const newCats = exists
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCats };
    });
  }, []);

  const toggleActiveAbility = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      activeAbilityOnly: !prev.activeAbilityOnly,
    }));
  }, []);

  const setSorting = useCallback((field: SortField) => {
    setFilters((prev) => {
      // Si clicamos el mismo campo, invertimos dirección. Si es nuevo, reseteamos a asc.
      const newDir =
        prev.sortBy === field && prev.sortDirection === "asc" ? "desc" : "asc";
      return { ...prev, sortBy: field, sortDirection: newDir };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_STATE);
  }, []);

  return {
    // Data
    toons: results,
    totalCount: results.length,
    isLoading: !isMounted,

    // State Values (Read-only para la UI)
    search: filters.search,
    selectedCategories: filters.categories,
    activeAbilityOnly: filters.activeAbilityOnly,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,

    queryString,
    // Actions
    setSearch,
    toggleCategory,
    toggleActiveAbility,
    setSorting,
    resetFilters,
  };
};
