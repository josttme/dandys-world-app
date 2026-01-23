const NavButton = ({ isActive, label, icon: Icon }) => {
  return (
    <div
      className={`group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 transition-all duration-200 md:h-auto md:w-full md:py-4 ${isActive ? "text-white" : "text-gray-600 hover:text-gray-400"} `}
    >
      {/* Contenedor del Icono */}
      <div className="rounded-xl p-2 transition-all duration-300">
        <Icon
          size={40}
          // Lógica visual: más grueso si está activo
          strokeWidth={isActive ? 2.5 : 2}
          stroke="currentColor"
        />
      </div>

      {/* Etiqueta de Texto */}
      <span className="hidden font-bold tracking-wider uppercase transition-colors md:flex md:text-sm">
        {label}
      </span>
    </div>
  );
};

export default NavButton;
