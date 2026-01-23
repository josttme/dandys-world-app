import { Search, ArrowUpAZ, ArrowDownAZ, X, Zap, Filter } from "lucide-react";
import type { ToonCategory, SortField } from "@/types";
import type { useCharacterFilters } from "@/hooks/useCharacterFilters";

// --- CONFIGURACIÓN VISUAL (Fuera del render para performance) ---
const CATEGORY_STYLES: Record<ToonCategory, string> = {
  main: "border-blue-500 text-blue-400 hover:bg-blue-500/10 data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:border-blue-600",
  normal:
    "border-green-500 text-green-400 hover:bg-green-500/10 data-[active=true]:bg-green-600 data-[active=true]:text-white data-[active=true]:border-green-600",
  lethal:
    "border-red-500 text-red-400 hover:bg-red-500/10 data-[active=true]:bg-red-600 data-[active=true]:text-white data-[active=true]:border-red-600",
  event:
    "border-purple-500 text-purple-400 hover:bg-purple-500/10 data-[active=true]:bg-purple-600 data-[active=true]:text-white data-[active=true]:border-purple-600",
  twisted:
    "border-slate-500 text-slate-400 hover:bg-slate-500/10 data-[active=true]:bg-slate-600 data-[active=true]:text-white data-[active=true]:border-slate-600",
};

// Definimos el tipo basado en el retorno del hook (Clean Architecture)
interface CharacterFiltersProps {
  controller: ReturnType<typeof useCharacterFilters>;
}

export const CharacterFilters = ({ controller }: CharacterFiltersProps) => {
  const {
    search,
    setSearch,
    selectedCategories,
    toggleCategory,
    activeAbilityOnly,
    toggleActiveAbility,
    sortBy,
    setSorting,
    sortDirection,
    resetFilters,
  } = controller;

  return (
    <div className="sticky top-4 z-30 mb-8 flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/80 p-3 shadow-xl backdrop-blur-xl transition-all md:flex-row md:items-center">
      {/* 1. ZONA DE BÚSQUEDA (Expandible en Desktop) */}
      <div className="relative w-full md:max-w-52">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar toon..."
          className="h-10 w-full rounded-xl border border-slate-700 bg-slate-950/50 pr-8 pl-9 text-sm text-slate-200 placeholder-slate-500 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="hidden h-4 w-px bg-slate-700 md:block" />

      {/* 2. ZONA DE FILTROS (Scroll horizontal en móvil) */}
      <div className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        {/* Toggle de Habilidad Activa */}
        <button
          onClick={toggleActiveAbility}
          data-active={activeAbilityOnly}
          className="group flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-xs font-medium text-slate-400 transition-all hover:border-yellow-500/50 hover:text-yellow-400 data-[active=true]:border-yellow-500 data-[active=true]:bg-yellow-500/10 data-[active=true]:text-yellow-400"
        >
          <Zap
            className={`h-3.5 w-3.5 ${activeAbilityOnly ? "fill-yellow-400" : ""}`}
          />
          <span>Active</span>
        </button>

        {/* Separador visual */}
        <div className="mx-1 h-4 w-px bg-slate-700" />

        {/* Categorías */}
        {(Object.keys(CATEGORY_STYLES) as ToonCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            data-active={selectedCategories.includes(cat)}
            className={`h-7 shrink-0 rounded-full border px-3 text-xs font-medium transition-all ${CATEGORY_STYLES[cat]}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* 3. ZONA DE ORDENAMIENTO (Compacta) */}
      <div className="flex items-center gap-2 border-t border-slate-700/50 pt-2 md:border-t-0 md:border-l md:border-slate-700 md:pt-0 md:pl-3">
        <select
          value={sortBy}
          onChange={(e) => setSorting(e.target.value as SortField)}
          className="h-9 cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 px-2 text-xs font-medium text-slate-300 hover:border-slate-600 focus:outline-none"
        >
          <option value="name">Nombre</option>
          <option value="releaseDate">Reciente</option>
          <option value="movementSpeed">Velocidad</option>
          <option value="stamina">Stamina</option>
          <option value="stealth">Sigilo</option>
        </select>

        {/* Botón de Dirección Inteligente */}
        <button
          onClick={() => setSorting(sortBy)} // Re-clicar invierte orden en el hook
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white"
          title={sortDirection === "asc" ? "Ascendente" : "Descendente"}
        >
          {sortDirection === "asc" ? (
            <ArrowUpAZ className="h-4 w-4" />
          ) : (
            <ArrowDownAZ className="h-4 w-4" />
          )}
        </button>

        {/* Botón Reset (Solo aparece si hay filtros activos) */}
        {(search ||
          selectedCategories.length > 0 ||
          activeAbilityOnly ||
          sortBy !== "name") && (
          <button
            onClick={resetFilters}
            className="ml-auto flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-red-400 hover:bg-red-500/10 md:ml-0"
          >
            <Filter className="h-3 w-3" />
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
