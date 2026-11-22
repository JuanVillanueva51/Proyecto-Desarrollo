"use client";

import { esDimension } from "@/lib/dimension";
import { SelectorDimension } from "./SelectorDimension";
import { Ventana } from "./Ventana";

export function VentanaConfiguracion() {
  return (
    <Ventana nombre="configuracion" titulo="Configuración" ancho="w-[min(820px,92vw)]">
      {() => {
        const guardada = document.documentElement.dataset.dimension;
        return (
          <div className="flex flex-col gap-3 p-5">
            <h3 className="font-pixel text-xl">Dimensión</h3>
            <SelectorDimension actual={esDimension(guardada) ? guardada : "overworld"} />
          </div>
        );
      }}
    </Ventana>
  );
}
