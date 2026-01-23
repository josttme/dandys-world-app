import rawData from "@data/characters.json";
import { CATEGORY_ORDER } from "@config/consts";
// Importamos los tipos desde el archivo que acabamos de crear
// Ajusta la ruta "../types" según tu estructura de carpetas real
import type { Toon, ToonCategory, FilterOptions, ToonStats } from "@/types";

// ==========================================
// 1. EL MAPPER (Transformación de Datos)
// ==========================================

const mapToon = (raw: any): Toon => {
  const categoryLower = raw.category.toLowerCase() as ToonCategory;

  // Lógica para determinar si es "Nuevo" (ej: lanzado en los últimos 30 días)
  const isNew = raw.releaseDate
    ? (new Date().getTime() - new Date(raw.releaseDate).getTime()) /
        (1000 * 3600 * 24) <
      30
    : false;

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    category: categoryLower,
    categoryLabel: raw.category.charAt(0).toUpperCase() + raw.category.slice(1),
    type: raw.type ? raw.type.toLowerCase() : "toon",
    event: raw.event || null,
    releaseDate: raw.releaseDate || null,
    isNew,
    images: {
      avatar: raw.images.avatar,
      full: raw.images.full,
    },
    stats: {
      health: Number(raw.stats.health),
      movementSpeed: Number(raw.stats.movementSpeed),
      skillCheck: Number(raw.stats.skillCheck),
      stamina: Number(raw.stats.stamina),
      stealth: Number(raw.stats.stealth),
      extractionSpeed: Number(raw.stats.extractionSpeed),
    },
    abilities: raw.abilities || [],
    skins: raw.skins || [],
    // Pre-calculamos esto para no hacerlo en cada render
    hasActiveAbility:
      raw.abilities?.some((ab: any) => ab.type.toLowerCase() === "active") ??
      false,
  };
};

// Cacheamos la lista limpia para no re-mapear en cada filtro
const ALL_TOONS: Toon[] = rawData.map(mapToon);

// ==========================================
// OPTIMIZACIÓN PREVIA (Fuera de la función)
// ==========================================

// 1. Mapa de Prioridad de Categorías O(1)
// En lugar de buscar en un array con .indexOf (lento), usamos un objeto (instantáneo).
// Tip: Asegúrate de que las claves coincidan con tus datos (minúsculas).
const CATEGORY_PRIORITY: Record<string, number> = {
  main: 0,
  normal: 1,
  twisted: 2,
  // ... resto de categorías
};

export const getToons = (options: FilterOptions = {}): Toon[] => {
  // Usamos spread para no mutar el array original, bien hecho.
  let result = [...ALL_TOONS];

  // --- FASE 1: FILTRADO (Tu código estaba perfecto aquí) ---
  if (options.searchTerm) {
    const term = options.searchTerm.toLowerCase();
    result = result.filter((toon) => toon.name.toLowerCase().includes(term));
  }

  if (options.categories && options.categories.length > 0) {
    result = result.filter((toon) =>
      options.categories!.includes(toon.category)
    );
  }

  if (options.hasActiveAbility !== undefined) {
    result = result.filter(
      (toon) => toon.hasActiveAbility === options.hasActiveAbility
    );
  }

  if (options.stats) {
    Object.entries(options.stats).forEach(([statKey, minValue]) => {
      const key = statKey as keyof ToonStats;
      if (typeof minValue === "number") {
        result = result.filter((toon) => toon.stats[key] >= minValue);
      }
    });
  }

  // --- FASE 2: ORDENAMIENTO OPTIMIZADO ---

  const sortField = options.sortBy || "default";
  const direction = options.sortDirection || "asc";

  // Micro-optimización: Resolvemos el multiplicador fuera
  const modifier = direction === "asc" ? 1 : -1;

  result.sort((a, b) => {
    // A. Ordenamiento por Defecto (Categoría -> Nombre)
    if (sortField === "default") {
      // Búsqueda O(1) en el mapa estático. ¡Mucho más rápido!
      const priorityA = CATEGORY_PRIORITY[a.category] ?? 999;
      const priorityB = CATEGORY_PRIORITY[b.category] ?? 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.name.localeCompare(b.name);
    }

    // B. Ordenamiento por Fecha (ISO STRING)
    // Ya no usamos new Date(). Al ser "YYYY-MM-DD", la comparación de strings funciona matemáticamente.
    if (sortField === "releaseDate") {
      // Manejo de nulos: Si no hay fecha, lo mandamos al final
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;

      // localeCompare es suficiente para strings ISO
      return a.releaseDate.localeCompare(b.releaseDate) * modifier;
    }

    // C. Ordenamiento por Estadísticas
    // Verificamos si la key existe en stats de manera segura
    if (sortField in a.stats) {
      const statKey = sortField as keyof ToonStats;
      // Resta simple numérica
      return (a.stats[statKey] - b.stats[statKey]) * modifier;
    }

    // D. Ordenamiento por Nombre
    if (sortField === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }

    return 0;
  });

  return result;
};

// ==========================================
// 3. HELPERS EXPORTADOS
// ==========================================

export const getToonById = (id: string): Toon | undefined => {
  return ALL_TOONS.find((t) => t.id === id);
};

export const getFirstToon = (): Toon => ALL_TOONS[0];
