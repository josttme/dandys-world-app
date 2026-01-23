import { Heart, HeartCrack } from "lucide-react";
import NavButton from "./NavButton";

// 1. OPTIMIZACIÓN: Calculamos las rutas fuera del componente.
// Al ser un archivo estático o importado en Astro, esto se ejecuta una vez al construir/cargar.
const getLinkForType = (type) => `/${type}/`;

// Pre-calculamos los enlaces para evitar búsquedas en cada render
const TOON_LINK = getLinkForType("toon");
const TWISTED_LINK = getLinkForType("twisted");

const Sidebar = ({ filter }) => {
  return (
    <>
      {/* NAVBAR CONTAINER */}
      {/* Correcciones: z-[100] (valor arbitrario), h-16 (estándar), max-w para evitar estiramientos raros */}
      <nav
        className={`safe-area-pb fixed bottom-0 left-0 z-100 flex h-16 w-full shrink-0 flex-row border-t border-white/10 bg-black/40 px-2 pb-2 backdrop-blur-md md:static md:h-screen md:w-24 md:flex-col md:justify-between md:gap-6 md:border-t-0 md:border-r md:px-0 md:pt-8 md:pb-0`}
      >
        <div className="flex w-full justify-self-center md:h-full md:flex-col md:justify-start md:gap-6">
          {/* BOTÓN TOONS */}
          {/* Asumimos que NavButton renderiza un <button>. 
              Para que sea válido dentro de <a>, NavButton debería renderizar un <div> 
              o pasarle el href al componente si soporta ser un <a>.
              Aquí mantengo el <a> envolvente pero asumiendo que corregirás NavButton para que no sea un <button> real si no es necesario.
          */}

          <a href={TOON_LINK} className="group flex flex-1 md:flex-none">
            <NavButton
              label="Toons"
              isActive={filter === "toon"}
              icon={Heart}
            />
          </a>

          {/* BOTÓN TWISTEDS */}
          <a href={TWISTED_LINK} className="group flex flex-1 md:flex-none">
            <NavButton
              label="Twisteds"
              isActive={filter === "twisted"}
              icon={HeartCrack}
            />
          </a>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
