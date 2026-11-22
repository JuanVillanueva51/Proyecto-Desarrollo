"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Esquema, Relacion } from "@/lib/datos/tipos";
import { BotonMc } from "../BotonMc";
import { EstadoVacio } from "../EstadoVacio";
import { Cofre, IconoTabla } from "../IconosPixel";
import { abrirVentana } from "@/lib/eventos";
import { marcaColumna } from "@/lib/marcas";
import { disenarMisiones, RADIO_NODO, type NodoTabla } from "./diseno";

type Props = {
  conexionId: string;
  esquemas: Esquema[];
  esquema: Esquema | null;
  alCambiarEsquema: (nombre: string) => void;
  tabla: string | null;
  alElegirTabla: (nombre: string) => void;
};

function Flecha({ desde, hasta, color, opacidad }: { desde: NodoTabla; hasta: NodoTabla; color: string; opacidad: number }) {
  const dx = hasta.x - desde.x;
  const dy = hasta.y - desde.y;
  const largo = Math.hypot(dx, dy) || 1;
  const ux = dx / largo;
  const uy = dy / largo;
  const px = hasta.x - ux * (RADIO_NODO + 6);
  const py = hasta.y - uy * (RADIO_NODO + 6);
  const bx = px - ux * 14;
  const by = py - uy * 14;
  const puntos = `${px},${py} ${bx - uy * 8},${by + ux * 8} ${bx + uy * 8},${by - ux * 8}`;
  return <polygon points={puntos} fill={color} opacity={opacidad} />;
}

function Arista({ relacion, origen, destino, activa, atenuada }: {
  relacion: Relacion;
  origen: NodoTabla;
  destino: NodoTabla;
  activa: boolean;
  atenuada: boolean;
}) {
  const color = origen.color;
  const opacidad = atenuada ? 0.4 : 1;
  const dx = destino.x - origen.x;
  const dy = destino.y - origen.y;
  const largo = Math.hypot(dx, dy) || 1;
  const ux = dx / largo;
  const uy = dy / largo;
  const nx = -uy * 16;
  const ny = ux * 16;
  const mx = origen.x + dx / 2;
  const my = origen.y + dy / 2;
  const etiqueta = `${relacion.columna} 1:N`;
  const anchoEtiqueta = etiqueta.length * 9 + 18;

  return (
    <g>
      <line
        x1={origen.x}
        y1={origen.y}
        x2={destino.x - ux * (RADIO_NODO + 14)}
        y2={destino.y - uy * (RADIO_NODO + 14)}
        stroke={color}
        strokeWidth={activa ? 6 : 4}
        opacity={opacidad}
        style={activa ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
      />
      <Flecha desde={origen} hasta={destino} color={color} opacidad={opacidad} />
      <text x={destino.x - ux * 64 + nx} y={destino.y - uy * 64 + ny} className="fill-white font-pixel text-base" textAnchor="middle" dominantBaseline="middle" opacity={opacidad}>
        1
      </text>
      <text x={origen.x + ux * 50 + nx} y={origen.y + uy * 50 + ny} className="fill-white font-pixel text-base" textAnchor="middle" dominantBaseline="middle" opacity={opacidad}>
        N
      </text>
      <g opacity={opacidad}>
        <rect x={mx - anchoEtiqueta / 2} y={my - 12} width={anchoEtiqueta} height={24} fill="var(--d-mision-panel)" stroke={color} strokeWidth={2} />
        <text x={mx} y={my + 1} className="fill-white font-term text-lg" textAnchor="middle" dominantBaseline="middle">
          {etiqueta}
        </text>
      </g>
    </g>
  );
}

export function VistaMisiones({ conexionId, esquemas, esquema, alCambiarEsquema, tabla, alElegirTabla }: Props) {
  const diseno = useMemo(() => (esquema ? disenarMisiones(esquema) : null), [esquema]);
  const porNombre = useMemo(() => new Map(diseno?.nodos.map((n) => [n.tabla.nombre, n]) ?? []), [diseno]);
  const seleccion = tabla ? porNombre.get(tabla) ?? null : null;

  const relacionesTabla = diseno && seleccion
    ? [
        ...diseno.relaciones
          .filter((r) => r.origen === seleccion.tabla.nombre)
          .map((r) => ({ flecha: "→", color: "#ff6b6b", tabla: r.destino, via: r.columna })),
        ...diseno.relaciones
          .filter((r) => r.destino === seleccion.tabla.nombre)
          .map((r) => ({ flecha: "←", color: "#80ff20", tabla: r.origen, via: r.columna })),
      ]
    : [];

  const totalRelaciones = diseno?.relaciones.length ?? 0;
  const totalTablas = esquema?.tablas.length ?? 0;

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside aria-label="Capítulos" className="flex w-full flex-col border-mc-mision-borde bg-mc-mision-alto lg:w-[230px] lg:shrink-0 lg:border-r-[3px]">
        <h2 className="px-4 pb-2 pt-3.5 font-pixel text-lg text-mc-oro">Capítulos</h2>
        {esquemas.length === 0 ? (
          <EstadoVacio texto="Sin esquemas" />
        ) : (
          <ul>
            {esquemas.map((e) => {
              const activo = e.nombre === esquema?.nombre;
              return (
                <li key={e.nombre}>
                  <button
                    type="button"
                    aria-pressed={activo}
                    onClick={() => alCambiarEsquema(e.nombre)}
                    className={`flex w-full items-center gap-2.5 border-l-4 px-4 py-2 text-left text-xl ${
                      activo ? "border-mc-oro bg-mc-mision-nodo text-white" : "border-transparent text-mc-suave hover:bg-mc-mision-nodo"
                    }`}
                  >
                    <Cofre tamano={22} />
                    {e.nombre}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-auto border-t-[3px] border-mc-mision-borde px-4 py-3.5 text-lg text-mc-suave">
          <p>Progreso del capítulo</p>
          <div aria-hidden="true" className="mt-1.5 flex h-3 border-2 border-black bg-mc-mision-borde">
            <span className={`${totalTablas > 0 ? "w-full" : "w-0"} bg-[#80ff20] shadow-[inset_0_-3px_0_#4fa10f]`} />
          </div>
          <p className="mt-1.5 text-[#80ff20]">
            {totalTablas} tablas · {totalRelaciones} relaciones
          </p>
        </div>
      </aside>

      <main className="textura-mision relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-center border-b-[3px] border-mc-mision-borde bg-black/40 p-3.5">
          <h2 className="sombra-texto font-pixel text-2xl text-white">
            {esquema ? `${esquema.nombre} · Diagrama de relaciones` : "Diagrama de relaciones"}
          </h2>
        </div>

        <div className="flex-1 overflow-auto">
          {!diseno ? (
            <EstadoVacio texto="Sin esquema" className="mt-16" />
          ) : (
            <div className="relative mx-auto my-5" style={{ width: diseno.ancho, height: diseno.alto }}>
              <svg width={diseno.ancho} height={diseno.alto} className="absolute inset-0" aria-hidden="true" style={{ shapeRendering: "auto" }}>
                {[...diseno.menores, ...diseno.nodos.filter((n) => !n.tabla.columnas.some((c) => c.referencia))].map((m, i) => (
                  <line key={i} x1={diseno.raiz.x} y1={diseno.raiz.y} x2={m.x} y2={m.y} stroke="#7a7f84" strokeWidth={2} strokeDasharray="8 6" />
                ))}
                {diseno.relaciones.map((r, i) => {
                  const origen = porNombre.get(r.origen);
                  const destino = porNombre.get(r.destino);
                  if (!origen || !destino || origen === destino) return null;
                  const activa = !!seleccion && (r.origen === seleccion.tabla.nombre || r.destino === seleccion.tabla.nombre);
                  return <Arista key={i} relacion={r} origen={origen} destino={destino} activa={activa} atenuada={!!seleccion && !activa} />;
                })}
              </svg>

              <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5" style={{ left: diseno.raiz.x, top: diseno.raiz.y }}>
                <span className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-mc-mision-borde bg-[#9a9a9a] shadow-[0_0_0_3px_#5a5a5a]">
                  <Cofre tamano={44} />
                </span>
                <span className="sombra-texto text-xl text-white">{esquema?.nombre}</span>
              </div>

              {diseno.menores.map((m) => (
                <div key={m.etiqueta} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1" style={{ left: m.x, top: m.y }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-mc-mision-borde bg-mc-mision-nodo">
                    <span className="h-2.5 w-2.5 border-2 border-mc-mision-borde" style={{ background: m.color }} />
                  </span>
                  <span className="sombra-texto text-lg text-mc-suave">{m.etiqueta}</span>
                </div>
              ))}

              {diseno.nodos.map((n) => {
                const activo = n.tabla.nombre === seleccion?.tabla.nombre;
                return (
                  <div key={n.tabla.nombre} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5" style={{ left: n.x, top: n.y }}>
                    <button
                      type="button"
                      aria-label={`Tabla ${n.tabla.nombre}`}
                      aria-pressed={activo}
                      onClick={() => alElegirTabla(n.tabla.nombre)}
                      className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-mc-mision-borde transition-transform hover:scale-110 ${
                        activo
                          ? "bg-mc-mision-nodo shadow-[0_0_0_3px_var(--d-oro),0_0_18px_4px_var(--d-oro)] brightness-125"
                          : "bg-mc-mision-nodo shadow-[0_0_0_2px_rgba(255,255,255,0.15)]"
                      }`}
                    >
                      <IconoTabla tamano={30} color={n.color} />
                    </button>
                    <span className={`sombra-texto whitespace-nowrap text-xl ${activo ? "text-mc-oro" : "text-white"}`}>{n.tabla.nombre}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t-[3px] border-mc-mision-borde bg-black/40 px-4 py-2 text-lg text-mc-suave">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1 w-7 bg-[#ffaa00]" />
            Llave foránea → tabla referenciada
          </li>
          <li>
            <b className="font-pixel text-white">1</b> padre · <b className="font-pixel text-white">N</b> hijo
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-7 bg-[repeating-linear-gradient(90deg,#7a7f84_0_8px,transparent_8px_14px)]" />
            Pertenece al esquema
          </li>
        </ul>
      </main>

      <aside aria-label="Detalle de la tabla" className="flex w-full flex-col border-mc-mision-borde bg-mc-mision-panel lg:w-[360px] lg:shrink-0 lg:border-l-[3px]">
        {seleccion ? (
          <>
            <div className="flex items-center gap-3 border-b-[3px] border-mc-mision-borde bg-mc-mision-alto px-4 py-4">
              <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border-[3px] border-mc-mision-borde bg-mc-mision-nodo">
                <IconoTabla tamano={30} color={seleccion.color} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-pixel text-2xl text-mc-oro">{seleccion.tabla.nombre}</h2>
                <p className="text-lg text-mc-suave">
                  {["Tabla", seleccion.tabla.motor, `${seleccion.tabla.columnas.length} columnas`].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            {seleccion.tabla.descripcion && (
              <p className="border-b-[3px] border-mc-mision-borde px-4 py-3.5 text-xl leading-snug text-mc-suave">{seleccion.tabla.descripcion}</p>
            )}
            <section className="border-b-[3px] border-mc-mision-borde px-4 py-3.5">
              <h3 className="mb-2 font-pixel text-base text-[#5bc8e6]">Tareas · Columnas</h3>
              <ul className="flex flex-col gap-1 text-xl">
                {seleccion.tabla.columnas.map((c) => {
                  const marca = marcaColumna(c);
                  return (
                    <li key={c.nombre} className="flex items-center gap-2.5 border-2 border-mc-mision-borde bg-mc-mision-alto px-2 py-1">
                      <span className="w-4" style={{ color: marca.color }}>{marca.icono}</span>
                      <span className="flex-1 text-white">{c.nombre}</span>
                      <span className="text-mc-suave">{c.tipo}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="px-4 py-3.5">
              <h3 className="mb-2 font-pixel text-base text-[#ffaa00]">Recompensas · Relaciones</h3>
              {relacionesTabla.length === 0 ? (
                <EstadoVacio texto="Sin relaciones" className="py-1 text-left" />
              ) : (
                <ul className="flex flex-col gap-1 text-xl">
                  {relacionesTabla.map((r, i) => (
                    <li key={i} className="flex items-center gap-2.5 border-2 border-mc-mision-borde bg-mc-mision-alto px-2 py-1">
                      <span style={{ color: r.color }}>{r.flecha}</span>
                      <span className="flex-1 text-white">{r.tabla}</span>
                      <span className="text-mc-suave">{r.via}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <div className="mt-auto flex gap-2.5 border-t-[3px] border-mc-mision-borde px-4 py-4">
              <Link
                href={`/conexion/${conexionId}/editor?esquema=${encodeURIComponent(esquema?.nombre ?? "")}&tabla=${encodeURIComponent(seleccion.tabla.nombre)}`}
                className="bisel-boton sombra-texto inline-flex h-11 flex-1 items-center justify-center border-2 border-black bg-mc-boton text-xl text-white"
              >
                Abrir en editor
              </Link>
              <BotonMc
                variante="confirmar"
                className="h-11 flex-1"
                onClick={() => esquema && abrirVentana("editor-tabla", { conexionId, esquema, tabla: seleccion.tabla })}
              >
                Editar tabla
              </BotonMc>
            </div>
          </>
        ) : (
          <EstadoVacio texto="Sin selección" className="mt-10" />
        )}
      </aside>
    </div>
  );
}
