"use client";

import { abrirConfiguracion } from "@/lib/eventos";
import { IconoEngrane } from "./IconosPixel";

export function BotonConfiguracion() {
  return (
    <button
      type="button"
      aria-label="Configuración"
      title="Configuración"
      aria-haspopup="dialog"
      onClick={abrirConfiguracion}
      className="ml-auto flex h-10 w-11 items-center justify-center border-[3px] border-b-0 border-black bg-mc-boton hover:bg-mc-hover"
    >
      <IconoEngrane />
    </button>
  );
}
