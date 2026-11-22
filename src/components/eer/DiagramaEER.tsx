"use client";

import { useState } from "react";
import type { Esquema } from "@/lib/datos/tipos";
import { BotonMc } from "../BotonMc";
import { IconoArbol, IconoTablas } from "../IconosPixel";
import { VistaClasica } from "./VistaClasica";
import { VistaMisiones } from "./VistaMisiones";

export type TipoVista = "misiones" | "clasica";

type Props = {
  conexionId: string;
  esquemas: Esquema[];
  vistaInicial: TipoVista;
};

export function DiagramaEER({ conexionId, esquemas, vistaInicial }: Props) {
  const [vista, setVista] = useState<TipoVista>(vistaInicial);
  const [nombreEsquema, setNombreEsquema] = useState<string | null>(esquemas[0]?.nombre ?? null);
  const esquema = esquemas.find((e) => e.nombre === nombreEsquema) ?? null;
  const [tabla, setTabla] = useState<string | null>(esquema?.tablas[0]?.nombre ?? null);

  const cambiarEsquema = (nombre: string) => {
    setNombreEsquema(nombre);
    setTabla(esquemas.find((e) => e.nombre === nombre)?.tablas[0]?.nombre ?? null);
  };

  const cambiarVista = (nueva: TipoVista) => {
    setVista(nueva);
    const url = new URL(window.location.href);
    url.searchParams.set("vista", nueva);
    window.history.replaceState(null, "", url);
  };

  const comunes = { esquemas, esquema, alCambiarEsquema: cambiarEsquema, tabla, alElegirTabla: setTabla };

  return (
    <div className="flex flex-1 flex-col">
      <div role="toolbar" aria-label="Vista del diagrama" className="textura-piedra flex flex-wrap items-center gap-2 border-b-4 border-black px-3 py-2">
        <BotonMc variante={vista === "misiones" ? "seleccionado" : "oscuro"} aria-pressed={vista === "misiones"} onClick={() => cambiarVista("misiones")}>
          <IconoArbol />
          Misiones
        </BotonMc>
        <BotonMc variante={vista === "clasica" ? "seleccionado" : "oscuro"} aria-pressed={vista === "clasica"} onClick={() => cambiarVista("clasica")}>
          <IconoTablas />
          Clásica
        </BotonMc>
      </div>
      {vista === "misiones" ? <VistaMisiones conexionId={conexionId} {...comunes} /> : <VistaClasica conexionId={conexionId} {...comunes} />}
    </div>
  );
}
