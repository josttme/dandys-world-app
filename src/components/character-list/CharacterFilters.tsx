// src/components/CharacterFilters.tsx
import React from "react";
import type { ToonCategory, SortField } from "@/types";
import type { FilterState } from "@/hooks/useCharacterFilters";

// --- CONFIGURACIÓN VISUAL ---
// Mapeamos tus valores de tipos.ts a etiquetas y colores para la UI
const CATEGORY_CONFIG: Record<ToonCategory, { label: string; color: string }> =
  {
    main: { label: "Main", color: "bg-blue-600 border-blue-400" },
    normal: { label: "Normal", color: "bg-green-600 border-green-400" },
    lethal: { label: "Lethal", color: "bg-red-600 border-red-400" },
    event: { label: "Event", color: "bg-purple-600 border-purple-400" },
    twisted: { label: "Twisted", color: "bg-slate-700 border-slate-500" },
  };

interface CharacterFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  sortOrder: SortField;
  onSortChange: (value: SortField) => void;
  isAscending: boolean;
  onDirectionToggle: () => void;
  onReset: () => void;
}

const CharacterFilters = ({
  filters,
  onFilterChange,
  sortOrder,
  onSortChange,
  isAscending,
  onDirectionToggle,
  onReset,
}: CharacterFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const toggleCategory = (cat: ToonCategory) => {
    const current = filters.categories;
    const newList = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onFilterChange({ ...filters, categories: newList });
  };

  const toggleActiveAbility = () => {
    onFilterChange({
      ...filters,
      activeAbilityOnly: !filters.activeAbilityOnly,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800/80 p-5 shadow-lg backdrop-blur-md">
      {/* 1. HEADER: Título y Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          🔍 Filtros
        </h2>

        <input
          type="text"
          placeholder="Buscar Toon..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:outline-none md:w-64"
        />
      </div>

      <hr className="border-slate-700/50" />

      {/* 2. FILTROS: Categorías */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase">
          Categoría
        </span>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_CONFIG) as ToonCategory[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const isActive = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? `${config.color} scale-105 text-white shadow-md`
                    : "border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FILTROS: Toggle Boolenao */}
      <div className="flex items-center">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-600 bg-slate-900/30 px-3 py-2 transition-colors hover:bg-slate-800">
          <input
            type="checkbox"
            checked={filters.activeAbilityOnly}
            onChange={toggleActiveAbility}
            className="h-4 w-4 rounded accent-yellow-400"
          />
          <span className="text-sm text-slate-300">
            Solo con Habilidad Activa
          </span>
        </label>
      </div>

      <hr className="border-slate-700/50" />

      {/* 4. ORDENAMIENTO */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Ordenar por:</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-yellow-400 focus:outline-none"
          >
            <option value="name">Nombre</option>
            <option value="releaseDate">Fecha Lanzamiento</option>
            {/* Stats nested */}
            <option value="stamina">Stamina</option>
            <option value="movementSpeed">Velocidad</option>
            <option value="health">Vida (Health)</option>
            <option value="skillCheck">Skill Check</option>
            <option value="stealth">Sigilo</option>
            <option value="extractionSpeed">Vel. Extracción</option>
          </select>

          <button
            onClick={onDirectionToggle}
            className="flex items-center justify-center rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-600"
          >
            {isAscending ? "Asc ⬆️" : "Desc ⬇️"}
          </button>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-red-400 hover:text-red-300 hover:underline"
        >
          Limpiar todo
        </button>
      </div>
    </div>
  );
};

export default CharacterFilters;
