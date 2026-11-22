"use client";

import { useEffect, useState } from "react";
import { EVENTO_AVISO, type Aviso } from "@/lib/eventos";
import { IconoCorrecto, IconoError, IconoRayo } from "./IconosPixel";

type AvisoVisible = Aviso & { id: number };

const COLOR: Record<Aviso["tipo"], string> = {
  exito: "text-[#80ff20]",
  error: "text-[#ff6b6b]",
  info: "text-mc-oro",
};

export function Avisos() {
  const [avisos, setAvisos] = useState<AvisoVisible[]>([]);

  useEffect(() => {
    let contador = 0;
    const recibir = (e: Event) => {
      const aviso = { ...(e as CustomEvent<Aviso>).detail, id: ++contador };
      setAvisos((lista) => [...lista, aviso]);
      window.setTimeout(() => setAvisos((lista) => lista.filter((a) => a.id !== aviso.id)), 4500);
    };
    window.addEventListener(EVENTO_AVISO, recibir);
    return () => window.removeEventListener(EVENTO_AVISO, recibir);
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-6 z-50 flex w-[min(360px,90vw)] flex-col gap-2">
      {avisos.map((a) => (
        <div
          key={a.id}
          className="textura-pizarra pointer-events-auto flex items-center gap-3 border-[3px] border-black px-3 py-2.5 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bisel-casilla bg-mc-casilla">
            {a.tipo === "exito" ? <IconoCorrecto tamano={20} /> : a.tipo === "error" ? <IconoError tamano={20} /> : <IconoRayo tamano={20} />}
          </span>
          <p className={`flex-1 text-xl leading-tight sombra-texto ${COLOR[a.tipo]}`}>{a.texto}</p>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setAvisos((lista) => lista.filter((x) => x.id !== a.id))}
            className="text-xl text-mc-suave hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
