"use client";

import { useEffect, useRef, useState } from "react";
import { MENUS } from "@/lib/menus";

// Barra de menús de tablones. Por ahora los menús solo se abren y cierran.
export function BarraMenus() {
  const [abierto, setAbierto] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const clicAfuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(null);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(null);
    };
    document.addEventListener("mousedown", clicAfuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", clicAfuera);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <nav
      ref={ref}
      aria-label="Menú principal"
      className="textura-tablones relative z-30 flex flex-wrap items-center gap-0.5 border-b-4 border-black px-2 py-0.5"
    >
      {MENUS.map((menu) => {
        const estaAbierto = abierto === menu.nombre;
        return (
          <div key={menu.nombre} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={estaAbierto}
              onClick={() => setAbierto(estaAbierto ? null : menu.nombre)}
              onMouseEnter={() => abierto && setAbierto(menu.nombre)}
              className={`px-3 py-0.5 text-xl ${
                estaAbierto ? "bg-[#2a1a0b] text-mc-menu" : "text-[#2a1a0b] hover:bg-black/15"
              }`}
            >
              {menu.nombre}
            </button>

            {estaAbierto && (
              <ul
                role="menu"
                aria-label={menu.nombre}
                className="absolute left-0 top-full mt-1 min-w-72 border-2 border-black bg-mc-menu py-1 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
              >
                {menu.items.map((item, i) =>
                  item.tipo === "separador" ? (
                    <li key={i} role="separator" className="my-1 h-0.5 bg-[#5a4020]" />
                  ) : (
                    <li key={i} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setAbierto(null)}
                        className="flex w-full items-center justify-between gap-10 px-3 py-0.5 text-left text-xl text-[#1e1205] hover:bg-mc-seleccion hover:text-white"
                      >
                        <span>{item.etiqueta}</span>
                        <span>{item.atajo ?? (item.submenu ? "▸" : "")}</span>
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
