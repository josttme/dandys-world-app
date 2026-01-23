import { Heart, Star } from "lucide-react";

const GameStats = ({ char }) => {
  if (!char || !char.stats) return null;

  const STAT_CONFIG = [
    {
      key: "health",
      label: "Salud",
      color: "bg-[#c85759]",
      icon: Heart,
    },
    {
      key: "skillCheck",
      label: "Verificación de Habilidad",
      color: "bg-[#c98f53]",
      icon: Star,
    },
    {
      key: "movementSpeed",
      label: "Velocidad de movimiento",
      color: "bg-[#cbcb5b]",
      icon: Star,
    },
    {
      key: "stamina",
      label: "Resistencia",
      color: "bg-[#57c455]",
      icon: Star,
    },
    {
      key: "stealth",
      label: "Sigilo",
      color: "bg-[#598ccb]",
      icon: Star,
    },
    {
      key: "extractionSpeed",
      label: "Velocidad de extracción",
      color: "bg-[#824ecc]", // Morado
      icon: Star,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-1 font-sans">
      {STAT_CONFIG.map((stat) => {
        // Obtenemos el valor del JSON (ej: 2, 3, 5)
        const value = char.stats[stat.key] || 0;
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="w-full overflow-hidden rounded-md shadow-sm"
          >
            {/* PARTE SUPERIOR: ETIQUETA DE COLOR */}
            <div
              className={`${stat.color} flex flex-col items-center justify-center border-b border-black/20 px-5 py-1`}
            >
              <span
                className="pb-1 text-[13px] font-black tracking-wide text-white uppercase md:text-xs"
                style={{
                  textShadow:
                    "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                }}
              >
                {stat.label}
              </span>

              {/* PARTE INFERIOR: ICONOS EN FONDO OSCURO */}
              <div className="flex h-7 w-full items-center justify-center bg-black/50 pt-1 pb-1">
                <div className="flex gap-2">
                  {/* Renderizamos la cantidad de iconos según el valor */}
                  {Array.from({ length: value }).map((_, i) => (
                    <Icon
                      key={i}
                      size={20}
                      className="fill-white text-white"
                      strokeWidth={0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameStats;
