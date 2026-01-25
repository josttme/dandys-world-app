import { useState, useMemo, useEffect, useCallback } from "react";
import type {
  ToonCategory,
  SortField,
  SortDirection,
  FilterOptions,
} from "@/types";
import { getToons } from "@/services/toonService";

// Interfaces (Igual que antes)
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
  sortBy: "name",
  sortDirection: "asc",
};

/** Helper puro para leer URL */
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
  // 1. ESTADO INICIAL "SEGURO" (MATCHES SERVER)
  // Inicializamos SIEMPRE con el estado por defecto.
  // Esto garantiza que el HTML del servidor y el primer HTML del cliente sean IDÉNTICOS.
  // Resultado: Carga instantánea y CERO errores rojos en consola.
  const [filters, setFilters] =
    useState<UseCharacterFiltersState>(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  // 2. SINCRONIZACIÓN INICIAL (MOUNT)
  // Apenas React toma el control, leemos la URL y actualizamos.
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      // Solo actualizamos si la URL tiene algo diferente al default
      // para evitar re-renders innecesarios.
      if (params.toString()) {
        const urlState = parseUrlParams(params);
        setFilters(urlState);
      }
    }
  }, []);

  // 3. LÓGICA DE NEGOCIO (Igual que antes)
  const results = useMemo(() => {
    const options: FilterOptions = {
      searchTerm: filters.search,
      categories: filters.categories,
      hasActiveAbility: filters.activeAbilityOnly ? true : undefined,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
    };
    return getToons(options);
  }, [filters]);

  // 4. GENERAR URL (Igual que antes)
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.activeAbilityOnly) params.set("active", "true");
    if (filters.categories.length > 0)
      params.set("cat", filters.categories.join(","));
    if (filters.sortBy !== "name") params.set("sort", filters.sortBy);
    if (filters.sortDirection !== "asc")
      params.set("dir", filters.sortDirection);
    return params.toString();
  }, [filters]);

  // 5. ESCRIBIR URL (Igual que antes)
  useEffect(() => {
    if (!isMounted) return;
    const currentBrowserParams = window.location.search.replace(/^\?/, "");
    if (queryString !== currentBrowserParams) {
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [queryString, isMounted]);

  // Handlers (Mantenemos la lógica de acciones)
  const setSearch = useCallback(
    (term: string) => setFilters((p) => ({ ...p, search: term })),
    []
  );

  const toggleCategory = useCallback((category: ToonCategory) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      const newCats = exists
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCats };
    });
  }, []);

  const toggleActiveAbility = useCallback(
    () =>
      setFilters((p) => ({ ...p, activeAbilityOnly: !p.activeAbilityOnly })),
    []
  );

  const setSorting = useCallback((field: SortField) => {
    setFilters((prev) => {
      const newDir =
        prev.sortBy === field && prev.sortDirection === "asc" ? "desc" : "asc";
      return { ...prev, sortBy: field, sortDirection: newDir };
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(INITIAL_STATE), []);

  return {
    toons: results,
    totalCount: results.length,
    isLoading: !isMounted, // Útil si quieres mostrar un skeleton
    search: filters.search,
    selectedCategories: filters.categories,
    activeAbilityOnly: filters.activeAbilityOnly,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
    queryString,
    setSearch,
    toggleCategory,
    toggleActiveAbility,
    setSorting,
    resetFilters,
  };
};
