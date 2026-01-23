// src/services/toonService.js
import rawData from "@data/characters.json"; // Tu JSON crudo generado por Python
import { CATEGORY_ORDER } from "@config/consts";

// --- 1. EL MAPPER (Función Privada) ---
// Transforma UN solo toon de sucio a limpio
// src/services/toonService.js

const mapToon = (rawToon) => {
  return {
    id: rawToon.id,
    name: rawToon.name,
    description: rawToon.description,

    // Categoría: "main", "normal", "lethal", "event"
    category: rawToon.category.toLowerCase(),
    categoryLabel:
      rawToon.category.charAt(0).toUpperCase() + rawToon.category.slice(1),

    type: "toon",

    // --- ¡AQUÍ ESTABA EL ERROR! ---
    // Te faltaba pasar esta propiedad. Sin ella, char.event es undefined.
    event: rawToon.event || null,
    // ------------------------------

    avatar: rawToon.images.avatar,
    fullImage: rawToon.images.full,
    stats: {
      health: rawToon.stats.health,
      movementSpeed: rawToon.stats.movementSpeed,
      skillCheck: rawToon.stats.skillCheck,
      stamina: rawToon.stats.stamina,
      stealth: rawToon.stats.stealth,
      extractionSpeed: rawToon.stats.extractionSpeed,
    },
    abilities: rawToon.abilities,
    skins: rawToon.skins,
  };
};

// 2. Obtener todos ordenados (Lógica Centralizada)
export const getAllToons = () => {
  const characters = rawData.map(mapToon);

  return characters.sort((a, b) => {
    const catA = a.category.toLowerCase();
    const catB = b.category.toLowerCase();
    const orderLower = CATEGORY_ORDER.map((c) => c.toLowerCase());

    let indexA = orderLower.indexOf(catA);
    let indexB = orderLower.indexOf(catB);

    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;

    if (indexA !== indexB) return indexA - indexB;
    return a.id.localeCompare(b.id);
  });
};

/**
 * BUSCADOR INTELIGENTE
 * Devuelve el primer personaje que cumpla con los filtros opcionales.
 * Como 'getAllToons' ya ordena por categoría, el .find() devolverá
 * siempre el de la categoría más importante.
 */
export const getFirstChar = (type, category) => {
  const all = getAllToons();

  return all.find((c) => {
    // Si type es undefined o null, esto da false y pasa al ": true" -> Filtro desactivado
    const matchType = type ? c.type === type : true;

    // Lo mismo aquí
    const matchCategory = category ? c.category === category : true;

    return matchType && matchCategory;
  });
};

// Obtener TODOS los toons ya limpios
/* export const getAllToons = () => {
  return rawData.map((toon) => mapToon(toon));
}; */

// Obtener UN toon por ID
export const getToonById = (id) => {
  const found = rawData.find((t) => t.id === id);
  return found ? mapToon(found) : null;
};

// Obtener toons filtrados (Ej: solo los Main)
export const getToonsByCategory = (category) => {
  return rawData
    .filter((t) => t.category.toLowerCase() === category.toLowerCase())
    .map((toon) => mapToon(toon));
};

export const getToonsByType = (type) => {
  // Obtenemos todos los toons ya limpios
  const all = getAllToons();

  // Si no pasan tipo, devolvemos todo, si no, filtramos
  if (!type) return all;

  // Filtramos comparando minúsculas (seguro gracias al mapper)
  return all.filter((t) => t.type === type.toLowerCase());
};
