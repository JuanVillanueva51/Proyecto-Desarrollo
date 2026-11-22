"use client";

import { useEffect, useRef, useState } from "react";
import { EVENTO_VENTANA, type DatosVentana, type DetalleVentana, type NombreVentana } from "@/lib/eventos";

type Props<K extends NombreVentana> = {
  nombre: K;
  titulo: string | ((datos: DatosVentana[K] | undefined) => string);
  ancho?: string;
  alCerrar?: (datos: DatosVentana[K] | undefined) => void;
  children: (datos: DatosVentana[K] | undefined, cerrar: () => void) => React.ReactNode;
};

export function Ventana<K extends NombreVentana>({ nombre, titulo, ancho = "w-[min(720px,92vw)]", alCerrar, children }: Props<K>) {
  const ref = useRef<HTMLDialogElement>(null);
  const [datos, setDatos] = useState<DatosVentana[K] | undefined>(undefined);
  const [abierta, setAbierta] = useState(false);
  const [version, setVersion] = useState(0);
  const datosRef = useRef<DatosVentana[K] | undefined>(undefined);

  useEffect(() => {
    const abrir = (e: Event) => {
      const detalle = (e as CustomEvent<DetalleVentana>).detail;
      if (detalle.nombre !== nombre) return;
      datosRef.current = detalle.datos as DatosVentana[K] | undefined;
      setDatos(datosRef.current);
      setVersion((v) => v + 1);
      setAbierta(true);
      if (!ref.current?.open) ref.current?.showModal();
    };
    window.addEventListener(EVENTO_VENTANA, abrir);
    return () => window.removeEventListener(EVENTO_VENTANA, abrir);
  }, [nombre]);

  const cerrar = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby={`titulo-${nombre}`}
      onClose={() => {
        setAbierta(false);
        alCerrar?.(datosRef.current);
      }}
      onClick={(e) => e.target === ref.current && cerrar()}
      className={`bisel-panel fixed inset-0 m-auto h-fit max-h-[90vh] border-[3px] border-black bg-mc-panel p-0 text-mc-tinta ${ancho}`}
    >
      <div className="textura-tablones flex items-center justify-between gap-3 border-b-[3px] border-black px-4 py-2">
        <h2 id={`titulo-${nombre}`} className="font-pixel text-xl text-mc-tablon-tinta">
          {typeof titulo === "function" ? titulo(datos) : titulo}
        </h2>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={cerrar}
          className="bisel-boton h-9 w-9 border-2 border-black bg-mc-boton text-xl text-white"
        >
          ✕
        </button>
      </div>
      {abierta && <div key={version}>{children(datos, cerrar)}</div>}
    </dialog>
  );
}
