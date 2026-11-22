import Link from "next/link";
import type { Conexion } from "@/lib/datos/tipos";
import { BloqueDimension, IconoEnchufe, IconoUsuario } from "./IconosPixel";

export function TarjetaConexion({ conexion }: { conexion: Conexion }) {
  return (
    <Link
      href={`/conexion/${conexion.id}/editor`}
      className="bisel-panel flex min-w-0 flex-col gap-1.5 border-2 border-black bg-mc-panel p-3 text-mc-tinta transition-transform hover:-translate-y-0.5"
    >
      <span className="flex items-center gap-2">
        <BloqueDimension tamano={26} className="shrink-0" />
        <span className="truncate font-pixel text-lg">{conexion.nombre}</span>
      </span>
      <span className="flex items-center gap-2 text-lg text-mc-ayuda">
        <IconoUsuario className="shrink-0" />
        {conexion.usuario}
      </span>
      <span className="flex min-w-0 items-center gap-2 text-lg text-mc-ayuda">
        <IconoEnchufe className="shrink-0" />
        <span className="truncate">
          {conexion.host}:{conexion.puerto}
        </span>
      </span>
    </Link>
  );
}
