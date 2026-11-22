"use client";

import { abrirVentana, type NombreVentana } from "@/lib/eventos";
import { BotonMc } from "./BotonMc";

type Props = {
  ventana: Exclude<NombreVentana, "editor-tabla" | "confirmacion">;
  children: React.ReactNode;
  variante?: "oscuro" | "claro" | "confirmar";
  className?: string;
  "aria-label"?: string;
};

export function BotonVentana({ ventana, children, variante, className, ...aria }: Props) {
  return (
    <BotonMc variante={variante} className={className} aria-label={aria["aria-label"]} onClick={() => abrirVentana(ventana)}>
      {children}
    </BotonMc>
  );
}
