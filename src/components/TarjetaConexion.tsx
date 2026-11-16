import type { ConexionDemo } from "@/lib/datos-demo";
import { BloquePasto, IconoEnchufe, IconoUsuario } from "./IconosPixel";

// Tarjeta de conexión: panel gris con relieve.
export function TarjetaConexion({ conexion }: { conexion: ConexionDemo }) {
  return (
    <button
      type="button"
      aria-label={`Abrir ${conexion.nombre}`}
      className="bisel-panel flex min-w-0 flex-col gap-1.5 border-2 border-black bg-mc-panel p-3 text-left text-mc-tinta transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2">
        <BloquePasto tamano={26} className="shrink-0" />
        <span className="truncate font-pixel text-lg">{conexion.nombre}</span>
      </div>
      <div className="flex items-center gap-2 text-lg">
        <IconoUsuario className="shrink-0" />
        <span>{conexion.usuario}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2 text-lg">
        <IconoEnchufe className="shrink-0" />
        <span className="truncate">{conexion.host}</span>
      </div>
    </button>
  );
}
