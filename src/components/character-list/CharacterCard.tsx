import type { Toon } from "@/types";

interface Props {
  character: Toon;
  isActive?: boolean;
  currentParams?: string;
}

export default function CharacterCard({
  character,
  isActive,
  currentParams,
}: Props) {
  // Construcción inteligente de la URL
  const baseUrl = `/${character.type}/${character.category || "general"}/${character.id}`;
  const finalUrl = currentParams ? `${baseUrl}?${currentParams}` : baseUrl;
  return (
    <a
      href={finalUrl}
      className={`group relative flex items-center gap-4 rounded-xl p-4 transition-all duration-300 ${
        isActive
          ? "bg-slate-800 shadow-lg ring-2 shadow-yellow-400/10 ring-yellow-400"
          : "border border-slate-700/50 bg-slate-800/50 hover:scale-[1.02] hover:border-slate-500 hover:bg-slate-800"
      } `}
    >
      {/* IMAGEN CON FALLBACK Y BORDE */}
      <div className="relative shrink-0">
        <img
          src={character.images.avatar}
          alt={character.name}
          className="h-16 w-16 rounded-lg bg-slate-900 object-cover shadow-sm ring-1 ring-white/10 group-hover:ring-white/30"
          loading="lazy"
        />
        {/* Badge de Categoría superpuesto */}
        <span
          className={`absolute -right-2 -bottom-2 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm ${getCategoryColor(character.category)}`}
        >
          {character.category}
        </span>
      </div>

      {/* INFO TEXTUAL */}
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-yellow-400">
          {character.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {/* Aquí podrías poner iconos de stats si quisieras */}
          <span>❤️ {character.stats.health}</span>
          <span>⚡ {character.stats.stamina}</span>
        </div>
      </div>

      {/* INDICADOR VISUAL DE "CLICK ME" (Flecha que aparece al hover) */}
      <div className="absolute right-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
        ➡️
      </div>
    </a>
  );
}

// Helper para colores (esto podría ir en un utils)
function getCategoryColor(cat: string) {
  const map: any = {
    main: "bg-blue-600",
    twisted: "bg-slate-600",
    lethal: "bg-red-600",
    // ...
  };
  return map[cat] || "bg-slate-500";
}
