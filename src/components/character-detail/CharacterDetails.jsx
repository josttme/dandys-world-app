import {
  Heart,
  Wind,
  Eye,
  Brain,
  Zap,
  Activity,
  Shield,
  PlayCircle,
} from "lucide-react";
import { getCharacterBackground } from "@utils/characterStyles";
import GameStats from "./GameStats";
import CharacterAvatar from "./CharacterAvatar";

const StatItem = ({ icon: Icon, label, value, max = 5 }) => (
  <div className="flex flex-col gap-1 rounded-xl bg-black/20 p-3 backdrop-blur-sm">
    <div className="flex items-center gap-2 text-white/60">
      <Icon size={16} />
      <span className="text-xs font-bold tracking-wider uppercase">
        {label}
      </span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-black text-white">{value}</span>
      {/* Barra visual de progreso pequeña */}
      <div className="mb-1 flex h-1.5 flex-1 gap-0.5 opacity-50">
        {[...Array(max)].map((_, i) => (
          <div
            key={i}
            className={`h-full w-full rounded-full ${
              i < value ? "bg-white" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);

const DetailHeader = ({ char }) => {
  const bgStyle = getCharacterBackground(char);

  return (
    <div className="relative overflow-y-auto">
      {/* FONDO DINÁMICO */}
      <div className="absolute inset-0 opacity-60" style={bgStyle} />
      <CharacterAvatar char={char} />
      <div className="relative flex flex-col gap-8 p-6 pt-32 md:flex-row md:items-end md:p-12">
        {/* 1. IMAGEN PRINCIPAL (Avatar o Full) */}
        <div className="shrink-0">
          <div className="relative h-48 w-48 overflow-hidden rounded-[30px] border-4 border-white/10 bg-black/30 shadow-2xl md:h-64 md:w-64">
            <img
              src={char.fullImage || char.avatar} // Preferimos full, si no avatar
              alt={char.name}
              className="h-full w-full object-contain p-4"
            />
          </div>
        </div>
        <div className="mt-6 mb-8 max-w-60">
          <GameStats char={char} />
        </div>

        {/* 2. INFO DE TEXTO */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white uppercase backdrop-blur-md">
                {char.categoryLabel} {/* "Main", "Normal", etc */}
              </span>
              {char.event && (
                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-300 uppercase backdrop-blur-md">
                  {char.event}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
              {char.name}
            </h1>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-white/80">
            {char.description}
          </p>
        </div>
      </div>
      {/* 3. GRID DE STATS (Usando camelCase del mapper) */}
      <div className="border-t border-white/5 bg-black/20 p-6 backdrop-blur-md md:p-8">
        <h3 className="mb-6 text-sm font-bold text-white/40 uppercase">
          Estadísticas Base
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatItem
            icon={Heart}
            label="Health"
            value={char.stats.health}
            max={3}
          />
          <StatItem
            icon={Brain}
            label="Skill Check"
            value={char.stats.skillCheck}
          />
          <StatItem
            icon={Wind}
            label="Speed"
            value={char.stats.movementSpeed}
          />
          <StatItem icon={Zap} label="Stamina" value={char.stats.stamina} />
          <StatItem icon={Eye} label="Stealth" value={char.stats.stealth} />
          <StatItem
            icon={Activity}
            label="Extraction"
            value={char.stats.extractionSpeed}
          />
        </div>
      </div>
      {/* 4. HABILIDADES */}
      {char.abilities && char.abilities.length > 0 && (
        <div className="border-t border-white/5 bg-white/5 p-6 md:p-8">
          <h3 className="mb-6 text-sm font-bold text-white/40 uppercase">
            Habilidades
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {char.abilities.map((ab, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-4"
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ab.type === "active" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}
                >
                  {ab.type === "active" ? (
                    <PlayCircle size={20} />
                  ) : (
                    <Shield size={20} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white">{ab.name}</h4>
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase ${ab.type === "active" ? "text-red-400" : "text-blue-400"}`}
                    >
                      {ab.typeLabel} {/* "Active" o "Passive" */}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{ab.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailHeader;
