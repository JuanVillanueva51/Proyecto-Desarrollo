"use client";

import { BotonIcono } from "../BotonIcono";
import { BotonMc } from "../BotonMc";
import { IconoAbrir, IconoDetener, IconoGuardar, IconoLupa, IconoNuevo, IconoRayo, IconoTablas } from "../IconosPixel";

function Separador() {
  return <span aria-hidden="true" className="mx-1.5 h-8 w-1 bg-black/60" />;
}

type Props = {
  constructorAbierto: boolean;
  alAlternarConstructor: () => void;
  alEjecutar: () => void;
  puedeEjecutar: boolean;
};

export function BarraHerramientasSql({ constructorAbierto, alAlternarConstructor, alEjecutar, puedeEjecutar }: Props) {
  return (
    <div
      role="toolbar"
      aria-label="Herramientas de consulta"
      className="textura-piedra flex flex-wrap items-center gap-1.5 border-b-4 border-black px-3 py-2"
    >
      <BotonIcono etiqueta="Nueva pestaña SQL">
        <IconoNuevo />
      </BotonIcono>
      <BotonIcono etiqueta="Abrir script">
        <IconoAbrir />
      </BotonIcono>
      <BotonIcono etiqueta="Guardar script">
        <IconoGuardar />
      </BotonIcono>
      <Separador />
      <BotonIcono etiqueta="Ejecutar todo" onClick={alEjecutar} disabled={!puedeEjecutar}>
        <IconoRayo />
      </BotonIcono>
      <BotonIcono etiqueta="Ejecutar sentencia actual" onClick={alEjecutar} disabled={!puedeEjecutar}>
        <IconoRayo actual />
      </BotonIcono>
      <BotonIcono etiqueta="Explicar consulta">
        <IconoLupa />
      </BotonIcono>
      <BotonIcono etiqueta="Detener">
        <IconoDetener />
      </BotonIcono>
      <Separador />
      <BotonMc
        variante={constructorAbierto ? "seleccionado" : "oscuro"}
        aria-pressed={constructorAbierto}
        onClick={alAlternarConstructor}
      >
        <IconoTablas />
        Constructor
      </BotonMc>
      <Separador />
      <BotonMc>Commit</BotonMc>
      <BotonMc>Rollback</BotonMc>
      <Separador />
      <label htmlFor="limite-filas" className="sombra-texto text-xl text-white">
        Limit to
      </label>
      <select id="limite-filas" defaultValue="1000" className="bisel-casilla h-10 bg-mc-casilla px-2 text-xl text-mc-tinta">
        <option value="200">200 rows</option>
        <option value="1000">1000 rows</option>
        <option value="0">Don&apos;t limit</option>
      </select>
    </div>
  );
}
