import rawData from "@data/characters.json";
import type {
  Toon,
  ToonCategory,
  FilterOptions,
  ToonStats,
  SortField,
  SortDirection,
  ToonSkin,
} from "@/types";

// ==========================================
// 1. CONFIGURACIÓN Y CONSTANTES
// ==========================================

const NEW_RELEASE_THRESHOLD_DAYS = 30;

// Definimos la prioridad explícita para cada categoría (para ordenamiento)
const CATEGORY_PRIORITY: Record<ToonCategory, number> = {
  main: 10,
  normal: 20,
  twisted: 30,
  lethal: 40,
  event: 50,
};

// ==========================================
// 2. TIPOS INTERNOS (Raw Data)
// ==========================================

/**
 * Representa la estructura cruda del JSON.
 * Esto nos protege de acceder a propiedades que no existen en rawData.
 */
interface RawToonAttributes {
  id: string;
  name: string;
  description: string;
  category: string;
  type?: string;
  event?: string;
  releaseDate?: string;
  images: { avatar: string; full: string };
  stats: Record<string, number | string>; // El JSON suele traer strings numéricos
  abilities?: Array<{ name: string; type: string; description: string }>;
  skins?: Array<{ name: string; image: string; description?: string }>;
}

// ==========================================
// 3. MAPPER (Transformación Data Layer -> Domain Layer)
// ==========================================

const mapToon = (raw: RawToonAttributes): Toon => {
  // Conversión segura de categoría
  const categoryLower = raw.category.toLowerCase() as ToonCategory;

  // Lógica de fecha: ¿Es un lanzamiento reciente?
  const isNew = raw.releaseDate
    ? (Date.now() - new Date(raw.releaseDate).getTime()) / (1000 * 3600 * 24) <
      NEW_RELEASE_THRESHOLD_DAYS
    : false;

  // Mapeo de Skins seguro
  const skins: ToonSkin[] = (raw.skins || []).map((skin) => ({
    name: skin.name,
    image: skin.image,
    description: skin.description,
  }));

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    category: categoryLower,
    // Capitalización simple para la UI
    categoryLabel: raw.category.charAt(0).toUpperCase() + raw.category.slice(1),
    type: raw.type?.toLowerCase() || "toon",
    event: raw.event || null,
    releaseDate: raw.releaseDate || null,
    isNew,
    images: {
      avatar: raw.images.avatar,
      full: raw.images.full,
    },
    // Conversión explícita a números para evitar bugs matemáticos
    stats: {
      health: Number(raw.stats.health || 0),
      movementSpeed: Number(raw.stats.movementSpeed || 0),
      skillCheck: Number(raw.stats.skillCheck || 0),
      stamina: Number(raw.stats.stamina || 0),
      stealth: Number(raw.stats.stealth || 0),
      extractionSpeed: Number(raw.stats.extractionSpeed || 0),
    },
    abilities: (raw.abilities || []).map((ab) => ({
      ...ab,
      type: ab.type.toLowerCase() as "active" | "passive", // Casteo seguro
    })),
    skins,
    // Computed Property: Optimización para filtros rápidos
    hasActiveAbility:
      raw.abilities?.some((ab) => ab.type.toLowerCase() === "active") ?? false,
  };
};

// Singleton: Procesamos la data una sola vez al cargar la app
// Asumimos que rawData es 'unknown' y lo casteamos al procesar
const ALL_TOONS: Toon[] = (rawData as unknown as RawToonAttributes[]).map(
  mapToon
);

// ==========================================
// 4. LOGICA DE ORDENAMIENTO (Isolated)
// ==========================================

const getComparator = (
  sortField: SortField | "default",
  direction: SortDirection
) => {
  const modifier = direction === "asc" ? 1 : -1;

  return (a: Toon, b: Toon): number => {
    // A. Ordenamiento por Defecto (Categoría -> Nombre)
    if (sortField === "default") {
      const priorityA = CATEGORY_PRIORITY[a.category] ?? 99;
      const priorityB = CATEGORY_PRIORITY[b.category] ?? 99;

      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.name.localeCompare(b.name);
    }

    // B. Ordenamiento por Fecha
    if (sortField === "releaseDate") {
      if (!a.releaseDate) return 1; // Sin fecha al final
      if (!b.releaseDate) return -1;
      return a.releaseDate.localeCompare(b.releaseDate) * modifier;
    }

    // C. Ordenamiento por Nombre
    if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }

    // D. Ordenamiento por Estadísticas (Numérico)
    // TypeScript sabe que si no es nombre ni fecha, es keyof ToonStats
    const statKey = sortField as keyof ToonStats;
    const statA = a.stats[statKey] || 0;
    const statB = b.stats[statKey] || 0;

    return (statA - statB) * modifier;
  };
};

// ==========================================
// 5. SERVICIO PRINCIPAL
// ==========================================

export const getToons = (options: FilterOptions = {}): Toon[] => {
  let result = [...ALL_TOONS];

  // --- FILTRADO ---

  // 1. Búsqueda de Texto
  if (options.searchTerm) {
    const term = options.searchTerm.toLowerCase();
    result = result.filter((toon) => toon.name.toLowerCase().includes(term));
  }

  // 2. Categorías (Multiselect)
  if (options.categories?.length) {
    result = result.filter((toon) =>
      options.categories!.includes(toon.category)
    );
  }

  // 3. Habilidad Activa
  if (options.hasActiveAbility !== undefined) {
    result = result.filter(
      (toon) => toon.hasActiveAbility === options.hasActiveAbility
    );
  }

  // 4. Estadísticas Mínimas
  if (options.stats) {
    Object.entries(options.stats).forEach(([key, minValue]) => {
      const statKey = key as keyof ToonStats;
      if (typeof minValue === "number") {
        result = result.filter((toon) => toon.stats[statKey] >= minValue);
      }
    });
  }

  // --- ORDENAMIENTO ---

  const sortField = options.sortBy || "default";
  const sortDirection = options.sortDirection || "asc";

  result.sort(getComparator(sortField, sortDirection));

  return result;
};

// ==========================================
// 6. HELPERS PÚBLICOS
// ==========================================

export const getToonById = (id: string): Toon | undefined => {
  return ALL_TOONS.find((t) => t.id === id);
};

export const getFirstToon = (): Toon => ALL_TOONS[0];
