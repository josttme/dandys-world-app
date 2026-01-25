import type { Toon, ToonCategory } from "@/types";

// Tipamos las props explícitamente para evitar errores de uso
interface CharacterCardProps {
  character: Toon;
  isActive?: boolean;
  currentParams?: string; // Opcional: Query string para mantener filtros (?q=astro&sort=desc)
}

// Configuración de estilos visuales extraída para mantener el JSX limpio.
// Usamos Record<Key, Value> para asegurar que cubrimos todas las categorías.
const CATEGORY_COLORS: Record<ToonCategory, string> = {
  main: "border-blue-500 shadow-blue-500/20",
  normal: "border-green-500 shadow-green-500/20",
  lethal: "border-red-500 shadow-red-500/20",
  event: "border-purple-500 shadow-purple-500/20",
  twisted: "border-slate-500 shadow-slate-500/20",
};

export default function CharacterCard({
  character,
  isActive = false,
  currentParams = "",
}: CharacterCardProps) {
  // 1. CONSTRUCCIÓN DE URL ROBUSTA
  // Normalizamos el query string: Si ya tiene '?', lo usamos tal cual, si no, lo agregamos.
  const queryString = currentParams
    ? currentParams.startsWith("?")
      ? currentParams
      : `?${currentParams}` // <--- IMPORTANTE: Agrega el ? si viene sin él
    : "";

  const href = `/${character.type}/${character.category || "normal"}/${character.id}${queryString}`;

  // 2. ESTILOS CONDICIONALES
  // Si está activo, lo resaltamos. Si no, aplicamos estilos base + hover.
  const activeStyles = isActive
    ? "ring-2 ring-yellow-400 bg-slate-800 scale-[1.02] shadow-xl"
    : "bg-slate-800/40 hover:bg-slate-800 hover:scale-[1.03] hover:shadow-lg border-transparent";

  // Obtenemos el color del borde basado en la categoría (Fallback seguro a slate)
  const categoryStyle =
    CATEGORY_COLORS[character.category] || CATEGORY_COLORS.normal;

  return (
    <a
      href={href}
      className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-300 ${activeStyles} ${isActive ? "border-yellow-400/50" : "border-slate-700/50 hover:border-slate-600"} `}
    >
      {/* CONTENEDOR DE IMAGEN 
        Usamos 'aspect-square' para asegurar que siempre sea bonita y simétrica 
      */}
      <div className="relative mb-3">
        <div
          className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-slate-900 transition-all duration-300 group-hover:shadow-md ${categoryStyle} `}
        >
          <img
            src={character.images.avatar}
            alt={`Avatar de ${character.name}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width={80} // Explicit width helps browser layout
            height={80}
          />
        </div>

        {/* Badge Flotante (Pequeño detalle de UX para saber categoría sin leer) 
          Posicionado en la esquina de la imagen
        */}
        <div
          className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-slate-800 ${categoryStyle.split(" ")[0].replace("border", "bg")}`}
          title={`Categoría: ${character.category}`}
        />
      </div>

      {/* NOMBRE */}
      <h3 className="font-display text-lg font-bold tracking-wide text-slate-100 uppercase">
        {character.name}
      </h3>

      {/* SUBTÍTULO OPCIONAL 
        Si quieres mostrar algo más (como ID o rareza) en letra pequeña 
      */}
      {character.isNew && (
        <span className="mt-1 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300 uppercase">
          NEW
        </span>
      )}
    </a>
  );
}
