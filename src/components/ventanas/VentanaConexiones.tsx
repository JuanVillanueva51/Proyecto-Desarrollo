"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { duplicarConexion, eliminarConexion } from "@/lib/datos/acciones";
import type { Conexion } from "@/lib/datos/tipos";
import { abrirVentana, confirmar } from "@/lib/eventos";
import { BotonMc } from "../BotonMc";
import { EstadoVacio } from "../EstadoVacio";
import { BloqueDimension } from "../IconosPixel";
import { Ventana } from "../Ventana";

function Contenido({ conexiones, cerrar }: { conexiones: Conexion[]; cerrar: () => void }) {
  const router = useRouter();
  const [elegida, setElegida] = useState<string | null>(conexiones[0]?.id ?? null);
  const [pendiente, iniciar] = useTransition();
  const conexion = conexiones.find((c) => c.id === elegida) ?? null;

  const duplicar = () => {
    if (!conexion) return;
    iniciar(async () => {
      await duplicarConexion(conexion.id);
      router.refresh();
    });
  };

  const eliminar = async () => {
    if (!conexion) return;
    const seguir = await confirmar({
      titulo: "Eliminar conexión",
      mensaje: `Se eliminará ${conexion.nombre} de la lista. La base de datos no se borra.`,
      confirmar: "Eliminar",
      peligro: true,
    });
    if (!seguir) return;
    iniciar(async () => {
      await eliminarConexion(conexion.id);
      setElegida(null);
      router.refresh();
    });
  };

  const accion = (etiqueta: string, href: string) =>
    conexion ? (
      <BotonMc variante="claro" href={href} className="w-full">
        {etiqueta}
      </BotonMc>
    ) : (
      <BotonMc variante="claro" disabled className="w-full">
        {etiqueta}
      </BotonMc>
    );

  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row">
      <div className="bisel-casilla min-h-64 flex-1 overflow-auto bg-mc-casilla">
        {conexiones.length === 0 ? (
          <EstadoVacio texto="Sin conexiones" tono="claro" />
        ) : (
          <ul role="listbox" aria-label="Conexiones">
            {conexiones.map((c) => {
              const activa = c.id === elegida;
              return (
                <li key={c.id} role="option" aria-selected={activa}>
                  <button
                    type="button"
                    onClick={() => setElegida(c.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${activa ? "bg-mc-seleccion text-white" : "text-mc-tinta hover:bg-white/30"}`}
                  >
                    <BloqueDimension tamano={26} className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-pixel text-base">{c.nombre}</span>
                      <span className="block truncate text-lg opacity-80">
                        {c.usuario}@{c.host}:{c.puerto}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-48">
        <BotonMc variante="confirmar" onClick={() => abrirVentana("conexion")} className="w-full">
          Nueva
        </BotonMc>
        {accion("Abrir", `/conexion/${conexion?.id}/editor`)}
        <BotonMc variante="claro" onClick={() => conexion && abrirVentana("conexion", { conexion })} disabled={!conexion} className="w-full">
          Editar
        </BotonMc>
        <BotonMc variante="claro" onClick={duplicar} disabled={!conexion || pendiente} className="w-full">
          Duplicar
        </BotonMc>
        <BotonMc variante="claro" onClick={() => abrirVentana("exportar", conexion ? { conexionId: conexion.id } : undefined)} disabled={!conexion} className="w-full">
          Exportar
        </BotonMc>
        <BotonMc variante="peligro" onClick={eliminar} disabled={!conexion || pendiente} className="w-full">
          Eliminar
        </BotonMc>
        <span className="flex-1" />
        <BotonMc variante="claro" onClick={cerrar} className="w-full">
          Cerrar
        </BotonMc>
      </div>
    </div>
  );
}

export function VentanaConexiones({ conexiones }: { conexiones: Conexion[] }) {
  return (
    <Ventana nombre="conexiones" titulo="Manage Connections" ancho="w-[min(760px,94vw)]">
      {(_, cerrar) => <Contenido conexiones={conexiones} cerrar={cerrar} />}
    </Ventana>
  );
}
