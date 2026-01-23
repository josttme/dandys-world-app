const GallerySection = ({
  title,
  items,
  onImageClick,
  icon: Icon,
  imageKey = "image",
}) => {
  // Si no hay items, no renderizamos nada (así evitamos secciones vacías)
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        {Icon && <Icon className="text-white/40" size={24} />}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white/50">
          {items.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, idx) => {
          // Resolvemos la imagen dinámicamente según la prop imageKey
          // Por defecto busca item.image (skins), pero soporta item.paper_2d si lo pasas
          const imgSrc = item[imageKey] || item.image;

          if (!imgSrc) return null;

          return (
            <button
              key={idx}
              onClick={() => onImageClick(imgSrc)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-black/20 transition-all hover:border-white/20 hover:bg-white/5"
            >
              <img
                src={imgSrc}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-8">
                <p className="truncate text-center text-xs font-bold text-white/90">
                  {item.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GallerySection;
