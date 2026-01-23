//@/types.ts
// ==========================================
// DEFINICIONES DE TIPOS (Interfaces)
// ==========================================

export type ToonCategory = "main" | "normal" | "lethal" | "event" | "twisted";
export type AbilityType = "active" | "passive";

// Interfaz para las Estadísticas
export interface ToonStats {
  health: number;
  movementSpeed: number;
  skillCheck: number;
  stamina: number;
  stealth: number;
  extractionSpeed: number;
}

// Interfaz del Toon "Limpio"
export interface Toon {
  id: string;
  name: string;
  description: string;
  category: ToonCategory;
  categoryLabel: string;
  type: string;
  event: string | null;
  releaseDate: string | null;
  isNew: boolean;
  images: {
    avatar: string;
    full: string;
  };
  stats: ToonStats;
  abilities: Array<{
    name: string;
    type: AbilityType;
    description: string;
  }>;
  // Agregado para coincidir con tu mapper
  skins: any[];
  hasActiveAbility: boolean;
}

// Opciones de Ordenamiento
export type SortField = "name" | "releaseDate" | keyof ToonStats;
export type SortDirection = "asc" | "desc";

// Opciones de Filtrado
export interface FilterOptions {
  searchTerm?: string; // Búsqueda por nombre (fuzzy)
  categories?: ToonCategory[]; // Array para multiselección
  stats?: Partial<ToonStats>; // Filtrar por min valor
  hasActiveAbility?: boolean; // ¿Tiene habilidad activa?
  sortBy?: SortField; // Campo de ordenamiento
  sortDirection?: SortDirection; // Dirección
}
