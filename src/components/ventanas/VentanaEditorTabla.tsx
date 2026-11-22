"use client";

import { useState, useTransition } from "react";
import { aplicarCambiosTabla } from "@/lib/datos/acciones";
import type { Columna, Esquema, Indice, Tabla } from "@/lib/datos/tipos";
import { avisar, type DatosVentana } from "@/lib/eventos";
import { BotonMc } from "../BotonMc";
import { EstadoVacio } from "../EstadoVacio";
import { CAMPO } from "../FilaCampo";
import { Ventana } from "../Ventana";

type Pestana = "columnas" | "llaves" | "indices";

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "columnas", etiqueta: "Columns" },
  { id: "llaves", etiqueta: "Foreign Keys" },
  { id: "indices", etiqueta: "Indexes" },
];

const TIPOS = ["INT", "BIGINT", "TINYINT", "DECIMAL(10,2)", "FLOAT", "VARCHAR(45)", "VARCHAR(255)", "TEXT", "DATE", "DATETIME", "TIMESTAMP", "BOOLEAN", "JSON"];

const CELDA = "h-8 min-w-0 w-full border-2 border-[#a0a0a0] bg-black px-1.5 text-lg text-white outline-none focus:border-white";
const CASILLA = "h-5 w-5 accent-mc-seleccion";

function Quitar({ etiqueta, onClick }: { etiqueta: string; onClick: () => void }) {
  return (
    <BotonMc variante="claro" aria-label={etiqueta} onClick={onClick} className="h-8 w-8 px-0">
      ✕
    </BotonMc>
  );
}

function copiar(tabla: Tabla): Tabla {
  return {
    ...tabla,
    columnas: tabla.columnas.map((c) => ({ ...c, referencia: c.referencia ? { ...c.referencia } : null })),
    indices: tabla.indices.map((i) => ({ ...i, columnas: [...i.columnas] })),
  };
}

function Contenido({ datos, cerrar }: { datos: DatosVentana["editor-tabla"]; cerrar: () => void }) {
  const [tabla, setTabla] = useState<Tabla>(() => copiar(datos.tabla));
  const [pestana, setPestana] = useState<Pestana>("columnas");
  const [pendiente, iniciar] = useTransition();
  const esquema: Esquema = datos.esquema;

  const columna = (i: number, cambio: Partial<Columna>) =>
    setTabla((t) => ({ ...t, columnas: t.columnas.map((c, j) => (j === i ? { ...c, ...cambio } : c)) }));
  const indice = (i: number, cambio: Partial<Indice>) =>
    setTabla((t) => ({ ...t, indices: t.indices.map((x, j) => (j === i ? { ...x, ...cambio } : x)) }));

  const conLlave = tabla.columnas.map((c, i) => ({ c, i })).filter(({ c }) => c.referencia);
  const sinLlave = tabla.columnas.map((c, i) => ({ c, i })).filter(({ c }) => !c.referencia);
  const columnasDe = (nombre: string) => esquema.tablas.find((t) => t.nombre === nombre)?.columnas.map((c) => c.nombre) ?? [];

  const aplicar = () =>
    iniciar(async () => {
      const salida = await aplicarCambiosTabla(datos.conexionId, esquema.nombre, datos.tabla.nombre, tabla);
      if (salida) avisar({ tipo: salida.correcto ? "exito" : "error", texto: salida.mensaje });
    });

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="grid grid-cols-1 items-center gap-x-3 gap-y-3 md:grid-cols-[130px_minmax(0,1fr)_90px_minmax(0,180px)]">
        <label htmlFor="tabla-nombre" className="text-xl md:text-right">
          Table Name:
        </label>
        <input id="tabla-nombre" value={tabla.nombre} onChange={(e) => setTabla({ ...tabla, nombre: e.target.value })} className={CAMPO} />
        <label htmlFor="tabla-motor" className="text-xl md:text-right">
          Engine:
        </label>
        <input id="tabla-motor" value={tabla.motor ?? ""} onChange={(e) => setTabla({ ...tabla, motor: e.target.value || null })} className={CAMPO} />
        <label htmlFor="tabla-comentario" className="text-xl md:text-right">
          Comments:
        </label>
        <input
          id="tabla-comentario"
          value={tabla.descripcion ?? ""}
          onChange={(e) => setTabla({ ...tabla, descripcion: e.target.value || null })}
          className={`${CAMPO} md:col-span-3`}
        />
      </div>

      <div>
        <div role="tablist" aria-label="Partes de la tabla" className="flex gap-1">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === pestana}
              onClick={() => setPestana(p.id)}
              className={`relative border-2 border-b-0 border-black px-4 py-0.5 text-lg ${p.id === pestana ? "top-0.5 bg-mc-panel" : "bg-mc-casilla hover:brightness-110"}`}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="max-h-[42vh] min-h-56 overflow-auto border-2 border-black bg-mc-panel p-3">
          <datalist id="tipos-mysql">
            {TIPOS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>

          {pestana === "columnas" && (
            <>
              <table className="w-full border-collapse text-lg">
                <thead>
                  <tr className="text-left">
                    <th scope="col" className="px-1 pb-1">Column Name</th>
                    <th scope="col" className="px-1 pb-1">Datatype</th>
                    <th scope="col" className="w-10 px-1 pb-1 text-center">PK</th>
                    <th scope="col" className="w-10 px-1 pb-1 text-center">NN</th>
                    <th scope="col" className="w-10 px-1 pb-1 text-center">AI</th>
                    <th scope="col" className="w-10 px-1 pb-1">
                      <span className="sr-only">Quitar</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.columnas.map((c, i) => (
                    <tr key={i}>
                      <td className="px-1 py-0.5">
                        <input aria-label="Nombre de columna" value={c.nombre} onChange={(e) => columna(i, { nombre: e.target.value })} className={CELDA} />
                      </td>
                      <td className="px-1 py-0.5">
                        <input aria-label="Tipo de dato" list="tipos-mysql" value={c.tipo} onChange={(e) => columna(i, { tipo: e.target.value })} className={CELDA} />
                      </td>
                      <td className="px-1 text-center">
                        <input aria-label="Llave primaria" type="checkbox" checked={c.llavePrimaria} onChange={(e) => columna(i, { llavePrimaria: e.target.checked })} className={CASILLA} />
                      </td>
                      <td className="px-1 text-center">
                        <input aria-label="No nulo" type="checkbox" checked={!c.nulo} onChange={(e) => columna(i, { nulo: !e.target.checked })} className={CASILLA} />
                      </td>
                      <td className="px-1 text-center">
                        <input aria-label="Auto incremento" type="checkbox" checked={c.autoIncremento} onChange={(e) => columna(i, { autoIncremento: e.target.checked })} className={CASILLA} />
                      </td>
                      <td className="px-1">
                        <Quitar etiqueta="Quitar columna" onClick={() => setTabla((t) => ({ ...t, columnas: t.columnas.filter((_, j) => j !== i) }))} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tabla.columnas.length === 0 && <EstadoVacio texto="Sin columnas" tono="claro" className="py-2" />}
              <BotonMc
                variante="claro"
                className="mt-2 h-9"
                onClick={() =>
                  setTabla((t) => ({
                    ...t,
                    columnas: [...t.columnas, { nombre: "", tipo: "VARCHAR(45)", llavePrimaria: false, autoIncremento: false, nulo: true, referencia: null }],
                  }))
                }
              >
                + Columna
              </BotonMc>
            </>
          )}

          {pestana === "llaves" && (
            <>
              {conLlave.length === 0 ? (
                <EstadoVacio texto="Sin llaves foráneas" tono="claro" className="py-2" />
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {conLlave.map(({ c, i }) => (
                    <li key={i} className="flex flex-wrap items-center gap-1.5 text-lg">
                      <span className="w-40 truncate">{c.nombre || "—"}</span>
                      <span>→</span>
                      <select
                        aria-label="Tabla referenciada"
                        value={c.referencia!.tabla}
                        onChange={(e) => columna(i, { referencia: { tabla: e.target.value, columna: columnasDe(e.target.value)[0] ?? "" } })}
                        className={`${CELDA} w-auto flex-1`}
                      >
                        {esquema.tablas.map((t) => (
                          <option key={t.nombre}>{t.nombre}</option>
                        ))}
                      </select>
                      <select
                        aria-label="Columna referenciada"
                        value={c.referencia!.columna}
                        onChange={(e) => columna(i, { referencia: { tabla: c.referencia!.tabla, columna: e.target.value } })}
                        className={`${CELDA} w-auto flex-1`}
                      >
                        {columnasDe(c.referencia!.tabla).map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                      <Quitar etiqueta="Quitar llave foránea" onClick={() => columna(i, { referencia: null })} />
                    </li>
                  ))}
                </ul>
              )}
              <BotonMc
                variante="claro"
                className="mt-2 h-9"
                disabled={sinLlave.length === 0 || esquema.tablas.length === 0}
                onClick={() => {
                  const destino = esquema.tablas[0];
                  if (!destino || !sinLlave[0]) return;
                  columna(sinLlave[0].i, { referencia: { tabla: destino.nombre, columna: destino.columnas[0]?.nombre ?? "" } });
                }}
              >
                + Llave foránea
              </BotonMc>
            </>
          )}

          {pestana === "indices" && (
            <>
              {tabla.indices.length === 0 ? (
                <EstadoVacio texto="Sin índices" tono="claro" className="py-2" />
              ) : (
                <ul className="flex flex-col gap-2">
                  {tabla.indices.map((x, i) => (
                    <li key={i} className="flex flex-col gap-1.5 border-b-2 border-black/15 pb-2">
                      <div className="flex items-center gap-2">
                        <input aria-label="Nombre del índice" value={x.nombre} onChange={(e) => indice(i, { nombre: e.target.value })} className={`${CELDA} flex-1`} />
                        <label className="flex items-center gap-1.5 text-lg">
                          <input type="checkbox" checked={x.unico} onChange={(e) => indice(i, { unico: e.target.checked })} className={CASILLA} />
                          UNIQUE
                        </label>
                        <Quitar etiqueta="Quitar índice" onClick={() => setTabla((t) => ({ ...t, indices: t.indices.filter((_, j) => j !== i) }))} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tabla.columnas.map((c) => {
                          const activa = x.columnas.includes(c.nombre);
                          return (
                            <button
                              key={c.nombre}
                              type="button"
                              aria-pressed={activa}
                              onClick={() => indice(i, { columnas: activa ? x.columnas.filter((n) => n !== c.nombre) : [...x.columnas, c.nombre] })}
                              className={`border-2 border-black px-2 text-lg ${activa ? "bg-mc-seleccion text-white" : "bisel-casilla bg-mc-casilla"}`}
                            >
                              {c.nombre || "—"}
                            </button>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <BotonMc
                variante="claro"
                className="mt-2 h-9"
                onClick={() => setTabla((t) => ({ ...t, indices: [...t.indices, { nombre: `idx_${t.nombre}_${t.indices.length + 1}`, columnas: [], unico: false }] }))}
              >
                + Índice
              </BotonMc>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <BotonMc variante="claro" onClick={() => setTabla(copiar(datos.tabla))}>
          Revertir
        </BotonMc>
        <BotonMc variante="claro" onClick={cerrar}>
          Cancelar
        </BotonMc>
        <BotonMc variante="confirmar" onClick={aplicar} disabled={pendiente || !tabla.nombre.trim()}>
          Aplicar
        </BotonMc>
      </div>
    </div>
  );
}

export function VentanaEditorTabla() {
  return (
    <Ventana nombre="editor-tabla" titulo="Table Editor" ancho="w-[min(920px,94vw)]">
      {(datos, cerrar) => (datos ? <Contenido datos={datos} cerrar={cerrar} /> : <EstadoVacio texto="Sin tabla" tono="claro" />)}
    </Ventana>
  );
}
