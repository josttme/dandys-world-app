import { X } from "lucide-react";
import { useEffect } from "react";

const ZoomOverlay = ({ imageSrc, onClose }) => {
  if (!imageSrc) return null;

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl duration-200"
      onClick={onClose} // Cerrar al hacer click fuera
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X size={32} />
      </button>

      <img
        src={imageSrc}
        alt="Zoom"
        className="animate-in zoom-in-95 max-h-full max-w-full rounded-lg object-contain shadow-2xl duration-300"
        onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer click en la imagen
      />
    </div>
  );
};

export default ZoomOverlay;
