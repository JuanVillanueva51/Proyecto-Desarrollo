"use client";

import { useMemo, useState } from "react";
import { colorTabla } from "@/lib/datos/esquema";
import type { Esquema } from "@/lib/datos/tipos";
import { abrirVentana } from "@/lib/eventos";
import { marcaColumna } from "@/lib/marcas";
import { EstadoVacio } from "../EstadoVacio";
import { disenarClasico, type TarjetaClasica } from "./diseno";

type Props = {
  conexionId: string;
  esquemas: Esquema[];
  esquema: Esquema | null;
  alCambiarEsquema: (nombre: string) => void;
  tabla: string | null;
  alElegirTabla: (nombre: string) => void;
};

const HERRAMIENTAS = [
  { glifo: "↖", etiqueta: "Seleccionar" },
  { glifo: "✥", etiqueta: "Mover lienzo" },
  { glifo: "⌫", etiqueta: "Borrador" },
  { glifo: "T", etiqueta: "Nota de texto" },
  { glifo: "▦", etiqueta: "Nueva tabla" },
  { glifo: "V", etiqueta: "Nueva vista" },
  { glifo: "1:1", etiqueta: "Relación uno a uno" },
  { glifo: "1:n", etiqueta: "Relación uno a muchos" },
  { glifo: "n:m", etiqueta: "Relación muchos a muchos" },
];

type Conector = { ruta: string; uno: { x: number; y: number }; muchos: { x: number; y: number } };

function conectar(hijo: TarjetaClasica, padre: TarjetaClasica): Conector {
  const hijoCx = hijo.x + hijo.ancho / 2;
  const padreCx = padre.x + padre.ancho / 2;
  const hijoCy = hijo.y + Math.min(hijo.alto / 2, 60);
  const padreCy = padre.y + Math.min(padre.alto / 2, 60);

  if (Math.abs(hijoCx - padreCx) > hijo.ancho / 2) {
    const haciaDerecha = padreCx > hijoCx;
    const sx = haciaDerecha ? hijo.x + hijo.ancho : hijo.x;
    const ex = haciaDerecha ? padre.x : padre.x + padre.ancho;
    const mx = Math.round((sx + ex) / 2);
    return {
      ruta: `M ${sx} ${hijoCy} H ${mx} V ${padreCy} H ${ex}`,
      muchos: { x: sx + (haciaDerecha ? 10 : -10), y: hijoCy - 10 },
      uno: { x: ex + (haciaDerecha ? -10 : 10), y: padreCy - 10 },
    };
  }

  const haciaAbajo = padre.y > hijo.y;
  const sy = haciaAbajo ? hijo.y + hijo.alto : hijo.y;
  const ey = haciaAbajo ? padre.y : padre.y + padre.alto;
  const my = Math.round((sy + ey) / 2);
  return {
    ruta: `M ${hijoCx} ${sy} V ${my} H ${padreCx} V ${ey}`,
    muchos: { x: hijoCx + 12, y: sy + (haciaAbajo ? 14 : -14) },
    uno: { x: padreCx + 12, y: ey + (haciaAbajo ? -14 : 14) },
  };
}

export function VistaClasica({ conexionId, esquemas, esquema, alCambiarEsquema, tabla, alElegirTabla }: Props) {
  const [zoom, setZoom] = useState(1);
  const diseno = useMemo(() => (esquema ? disenarClasico(esquema) : null), [esquema]);
  const porNombre = useMemo(() => new Map(diseno?.tarjetas.map((t) => [t.tabla.nombre, t]) ?? []), [diseno]);

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside aria-label="Catálogo" className="textura-pizarra flex w-full flex-col border-black lg:w-[250px] lg:shrink-0 lg:border-r-4">
        <div className="flex gap-1 px-2.5 pt-2.5">
          <button type="button" className="h-9 flex-1 border-[3px] border-b-0 border-black bg-mc-panel text-lg text-mc-tinta">
            Catalog Tree
          </button>
          <button type="button" className="h-9 flex-1 border-[3px] border-b-0 border-black bg-mc-boton text-lg text-white">
            Layers
          </button>
        </div>
        <div className="border-t-[3px] border-black p-2.5 text-xl leading-relaxed text-white">
          {esquemas.length === 0 ? (
            <EstadoVacio texto="Sin esquemas" />
          ) : (
            <ul>
              {esquemas.map((e) => {
                const activo = e.nombre === esquema?.nombre;
                return (
                  <li key={e.nombre}>
                    <button type="button" aria-pressed={activo} onClick={() => alCambiarEsquema(e.nombre)} className="flex items-center gap-2 text-left">
                      <span className="text-mc-suave">{activo ? "▾" : "▸"}</span>
                      <span className={activo ? "text-mc-oro" : ""}>{e.nombre}</span>
                    </button>
                    {activo && (
                      <ul className="pl-6">
                        <li>
                          <span className="text-mc-suave">▾</span> Tables
                          <ul className="pl-6">
                            {e.tablas.map((t, i) => (
                              <li key={t.nombre}>
                                <button
                                  type="button"
                                  aria-pressed={t.nombre === tabla}
                                  onClick={() => alElegirTabla(t.nombre)}
                                  className={`flex w-full items-center gap-2 px-1 text-left ${t.nombre === tabla ? "bg-mc-seleccion" : "hover:bg-white/10"}`}
                                >
                                  <span aria-hidden="true" className="h-3 w-3 border-2 border-black" style={{ background: colorTabla(i) }} />
                                  {t.nombre}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <span className="text-mc-suave">▸</span> Views
                        </li>
                        <li>
                          <span className="text-mc-suave">▸</span> Routine Groups
                        </li>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <section aria-labelledby="titulo-leyenda" className="mt-auto border-t-4 border-black p-3 text-lg leading-relaxed text-white">
          <h2 id="titulo-leyenda" className="mb-1.5 font-pixel text-lg">
            Leyenda
          </h2>
          <p>
            <span className="text-[#ffd23f]">◆</span> Llave primaria
          </p>
          <p>
            <span className="text-[#ff6b6b]">◆</span> Llave foránea
          </p>
          <p>
            <span className="text-[#9ad7ea]">◇</span> Columna
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-1 w-7 bg-mc-cable" /> Relación
          </p>
        </section>
      </aside>

      <div role="toolbar" aria-label="Herramientas del diagrama" aria-orientation="vertical" className="textura-piedra flex shrink-0 flex-row flex-wrap items-center gap-1.5 border-black p-2.5 lg:w-16 lg:flex-col lg:border-r-4">
        {HERRAMIENTAS.map((h, i) => (
          <button
            key={h.etiqueta}
            type="button"
            aria-label={h.etiqueta}
            title={h.etiqueta}
            className={`bisel-casilla h-11 w-11 font-pixel text-sm font-semibold text-mc-tinta ${i === 0 ? "bg-mc-panel" : "bg-mc-casilla"}`}
          >
            {h.glifo}
          </button>
        ))}
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="textura-lienzo min-h-[560px] flex-1 overflow-auto">
          {!diseno ? (
            <EstadoVacio texto="Sin esquema" className="mt-16" />
          ) : (
            <div style={{ width: diseno.ancho * zoom, height: diseno.alto * zoom }}>
              <div className="relative origin-top-left" style={{ width: diseno.ancho, height: diseno.alto, transform: `scale(${zoom})` }}>
                <svg width={diseno.ancho} height={diseno.alto} className="absolute inset-0" aria-hidden="true">
                  {diseno.relaciones.map((r, i) => {
                    const hijo = porNombre.get(r.origen);
                    const padre = porNombre.get(r.destino);
                    if (!hijo || !padre || hijo === padre) return null;
                    const c = conectar(hijo, padre);
                    const activa = tabla === r.origen || tabla === r.destino;
                    return (
                      <g key={i}>
                        <path d={c.ruta} fill="none" stroke="var(--d-cable)" strokeWidth={activa ? 5 : 3} style={{ filter: "drop-shadow(0 0 1px #000)" }} />
                        <text x={c.muchos.x} y={c.muchos.y} className="fill-mc-oro font-pixel text-sm" textAnchor="middle">
                          n
                        </text>
                        <text x={c.uno.x} y={c.uno.y} className="fill-mc-oro font-pixel text-sm" textAnchor="middle">
                          1
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {diseno.tarjetas.map((t) => {
                  const activa = t.tabla.nombre === tabla;
                  return (
                    <button
                      key={t.tabla.nombre}
                      type="button"
                      aria-pressed={activa}
                      onClick={() => alElegirTabla(t.tabla.nombre)}
                      onDoubleClick={() => esquema && abrirVentana("editor-tabla", { conexionId, esquema, tabla: t.tabla })}
                      className={`bisel-panel absolute border-[3px] border-black bg-mc-panel text-left text-mc-tinta ${activa ? "outline-[3px] outline-offset-2 outline-mc-oro" : ""}`}
                      style={{ left: t.x, top: t.y, width: t.ancho, minHeight: t.alto }}
                    >
                      <span className="flex items-center gap-2 border-b-[3px] border-black px-2.5 py-1.5 font-pixel text-lg" style={{ background: t.color }}>
                        {t.tabla.nombre}
                      </span>
                      <span className="flex flex-col px-2.5 py-1.5 text-lg leading-[26px]">
                        {t.tabla.columnas.map((c) => {
                          const marca = marcaColumna(c);
                          return (
                            <span key={c.nombre} className="flex gap-2 whitespace-nowrap">
                              <span className="w-3.5" style={{ color: marca.colorClaro }}>{marca.icono}</span>
                              <span className="flex-1 truncate">{c.nombre}</span>
                              <span className="text-mc-ayuda">{c.tipo}</span>
                            </span>
                          );
                        })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="textura-piedra sombra-texto flex flex-wrap items-center gap-3 border-t-4 border-black px-4 py-2 text-xl">
          <span>Zoom:</span>
          <button type="button" aria-label="Alejar" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))} className="bisel-boton h-9 w-9 border-2 border-black bg-mc-boton">
            −
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Acercar" onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))} className="bisel-boton h-9 w-9 border-2 border-black bg-mc-boton">
            +
          </button>
          <span className="ml-auto">
            {esquema?.tablas.length ?? 0} tablas · {diseno?.relaciones.length ?? 0} relaciones
          </span>
        </div>
      </main>
    </div>
  );
}
