"use client";

import { useState } from "react";
import { COOKIE_DIMENSION, DIMENSIONES, NOMBRE_DIMENSION, type Dimension } from "@/lib/dimension";
import { BloqueDimension, Cofre } from "./IconosPixel";

export function SelectorDimension({ actual }: { actual: Dimension }) {
  const [elegida, setElegida] = useState<Dimension>(actual);

  const cambiar = (dimension: Dimension) => {
    document.cookie = `${COOKIE_DIMENSION}=${dimension}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.dataset.dimension = dimension;
    setElegida(dimension);
  };

  return (
    <div role="radiogroup" aria-label="Dimensión" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {DIMENSIONES.map((d) => {
        const activa = d === elegida;
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={activa}
            data-dimension={d}
            onClick={() => cambiar(d)}
            className={`textura-suelo flex flex-col items-center gap-3 border-[3px] p-4 ${
              activa ? "border-white shadow-[0_0_0_3px_#000,0_0_18px_4px_var(--d-oro)]" : "border-black hover:brightness-110"
            }`}
          >
            <span className="textura-tablones flex w-full items-center justify-center gap-3 border-2 border-black py-3">
              <BloqueDimension tamano={40} />
              <Cofre tamano={40} />
            </span>
            <span className="sombra-texto font-pixel text-2xl text-white">{NOMBRE_DIMENSION[d]}</span>
          </button>
        );
      })}
    </div>
  );
}
