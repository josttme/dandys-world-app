//@utils/characterStyles.ts
import type { CSSProperties } from "react";

// Interfaz para saber qué datos recibimos
interface ToonStyleProps {
  category: string; // "main", "normal", "lethal"
  type?: string; // "toon", "twisted"
  event?: string | null; // "Easter", "Christmas" (La clave del problema)
}

// 1. DEFINIR GRADIENTES
// Usamos claves en minúscula para evitar líos
const GRADIENTS: Record<string, string> = {
  main: "linear-gradient(to bottom, #4E1B1F, #442E16, #403E15, #15401A, #132E35, #23183E, #581757)",
  easter: "linear-gradient(to bottom, #71475d, #6c6347, #29656c)",
  halloween: "linear-gradient(to bottom, #3c1b5a, #6e3400)",
  christmas: "linear-gradient(to bottom, #5d1c1a, #124a19)",
  lethal: "linear-gradient(to bottom, #F56565, #C01E1E)",
  normal: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))",
};

export const getCharacterBackground = (char: ToonStyleProps): CSSProperties => {
  if (!char) return { background: GRADIENTS.normal };
  // 2. NORMALIZAR DATOS
  // Convertimos a minúsculas para comparar seguro
  const category = char.category ? char.category.toLowerCase() : "normal";

  // ¡CORRECCIÓN AQUÍ! Usamos char.event, no char.event_type
  const eventName = char.event ? char.event.toLowerCase() : null;

  // 3. LOGICA DE SELECCIÓN

  // A) CASO LETHAL (Prioridad absoluta)
  if (category === "lethal" || char.type === "lethal") {
    return { background: GRADIENTS.lethal };
  }

  // B) CASO HÍBRIDO (Main + Evento) -> FONDO DIVIDIDO
  // Si es Main Y tiene evento Y tenemos gradiente para ese evento
  if (category === "main" && eventName && GRADIENTS[eventName]) {
    return {
      // Truco CSS: Dos imágenes de fondo.
      // 1. Gradiente Main (Izquierda)
      // 2. Gradiente Evento (Derecha)
      backgroundImage: `${GRADIENTS.main}, ${GRADIENTS[eventName]}`,
      backgroundSize: "50% 100%, 50% 100%", // Ambos ocupan la mitad del ancho
      backgroundPosition: "0% 0%, 100% 0%", // Uno pegado a la izq, otro a la der
      backgroundRepeat: "no-repeat",
    };
  }

  // C) CASO SOLO MAIN
  if (category === "main") {
    return { background: GRADIENTS.main };
  }

  // D) CASO SOLO EVENTO (Si hubiera Toons de evento que no son Main)
  if (category === "event" && eventName && GRADIENTS[eventName]) {
    return { background: GRADIENTS[eventName] };
  }

  // E) DEFAULT
  return { background: GRADIENTS.normal };
};
