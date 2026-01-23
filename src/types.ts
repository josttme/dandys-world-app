// ==========================================
// DOMAIN TYPES (Tipos de Dominio)
// ==========================================

export type ToonCategory = "main" | "normal" | "lethal" | "event" | "twisted";
export type AbilityType = "active" | "passive";

// ==========================================
// INTERFACES DE DATOS
// ==========================================

/**
 * Representa una Skin o variante visual de un Toon.
 */
export interface ToonSkin {
  name: string;
  image: string;
  description?: string;
}

/**
 * Estadísticas base de un personaje.
 */
export interface ToonStats {
  health: number;
  movementSpeed: number;
  skillCheck: number;
  stamina: number;
  stealth: number;
  extractionSpeed: number;
}

/**
 * Entidad principal del Toon (Procesada para UI).
 */
export interface Toon {
  id: string;
  name: string;
  description: string;

  // Categorización
  category: ToonCategory;
  categoryLabel: string;
  type: string;

  // Metadatos
  event: string | null;
  releaseDate: string | null; // Formato ISO recomendaddo (YYYY-MM-DD)
  isNew: boolean;

  // Assets
  images: {
    avatar: string;
    full: string;
  };

  // Datos de Juego
  stats: ToonStats;
  abilities: Array<{
    name: string;
    type: AbilityType;
    description: string;
  }>;

  // Coleccionables
  skins: ToonSkin[];

  // Computed helpers (Banderas booleanas para lógica rápida)
  hasActiveAbility: boolean;
}

// ==========================================
// FILTROS Y ORDENAMIENTO
// ==========================================

export type SortField = "name" | "releaseDate" | keyof ToonStats;
export type SortDirection = "asc" | "desc";

export interface FilterOptions {
  searchTerm?: string; // Búsqueda difusa (fuzzy search)
  categories?: ToonCategory[]; // Multiselección
  stats?: Partial<ToonStats>; // Filtros de valor mínimo (ej: stamina > 100)
  hasActiveAbility?: boolean; // Toggle de habilidad
  sortBy?: SortField; // Clave de ordenamiento
  sortDirection?: SortDirection; // Dirección
}
