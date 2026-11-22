"use client";

import { useRef } from "react";
import { BotonMc } from "./BotonMc";
import { Ventana } from "./Ventana";

export function VentanaConfirmacion() {
  const aceptado = useRef(false);

  return (
    <Ventana
      nombre="confirmacion"
      titulo="Confirmar"
      ancho="w-[min(480px,92vw)]"
      alCerrar={(datos) => {
        datos?.resolver(aceptado.current);
        aceptado.current = false;
      }}
    >
      {(datos, cerrar) => (
        <div className="flex flex-col gap-4 p-5">
          <p className="font-pixel text-lg">{datos?.titulo}</p>
          <p className="text-xl leading-snug text-mc-ayuda">{datos?.mensaje}</p>
          <div className="flex justify-end gap-3">
            <BotonMc variante="claro" onClick={cerrar}>
              Cancelar
            </BotonMc>
            <BotonMc
              variante={datos?.peligro ? "peligro" : "confirmar"}
              onClick={() => {
                aceptado.current = true;
                cerrar();
              }}
            >
              {datos?.confirmar ?? "Aceptar"}
            </BotonMc>
          </div>
        </div>
      )}
    </Ventana>
  );
}
