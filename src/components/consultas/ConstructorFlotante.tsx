"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { relacionesDe } from "@/lib/datos/esquema";
import {
  OPERADORES,
  type Asignacion,
  type Esquema,
  type Filtro,
  type Operador,
  type Orden,
  type PeticionConsulta,
  type TipoConsulta,
  type Union,
} from "@/lib/datos/tipos";
import { EstadoVacio } from "../EstadoVacio";

const TIPOS: TipoConsulta[] = ["SELECT", "INSERT", "UPDATE", "DELETE"];
const SIN_VALOR: Operador[] = ["IS NULL", "IS NOT NULL"];

const CAMPO = "h-8 min-w-0 flex-1 border-2 border-[#a0a0a0] bg-black px-1.5 text-lg text-white outline-none focus:border-white disabled:opacity-50";
const BOTON = "bisel-boton-claro h-8 shrink-0 border-2 border-black bg-[color-mix(in_srgb,var(--d-panel)_70%,white)] px-2.5 text-lg text-mc-tinta disabled:cursor-not-allowed disabled:opacity-50";
const CHIP_ACTIVO = "border-2 border-black bg-mc-seleccion px-2 text-lg text-white";
const CHIP = "bisel-casilla border-2 border-black bg-mc-casilla px-2 text-lg text-mc-tinta";

function Bloque({ titulo, accion, children }: { titulo: string; accion?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5 border-t-2 border-black/20 pt-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-pixel text-base">{titulo}</h3>
        {accion}
      </div>
      {children}
    </section>
  );
}

function Quitar({ etiqueta, onClick }: { etiqueta: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={etiqueta} onClick={onClick} className={`${BOTON} w-8 px-0`}>
      ✕
    </button>
  );
}

function Filtros({ columnas, filtros, alCambiar }: { columnas: string[]; filtros: Filtro[]; alCambiar: (f: Filtro[]) => void }) {
  const cambiar = (i: number, cambio: Partial<Filtro>) => alCambiar(filtros.map((f, j) => (j === i ? { ...f, ...cambio } : f)));
  return (
    <Bloque
      titulo="WHERE"
      accion={
        <button
          type="button"
          className={BOTON}
          disabled={columnas.length === 0}
          onClick={() => alCambiar([...filtros, { columna: columnas[0], operador: "=", valor: "" }])}
        >
          + Filtro
        </button>
      }
    >
      {filtros.length === 0 ? (
        <EstadoVacio texto="Sin filtros" tono="claro" className="py-0 text-lg" />
      ) : (
        filtros.map((f, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <select aria-label="Columna" value={f.columna} onChange={(e) => cambiar(i, { columna: e.target.value })} className={CAMPO}>
              {columnas.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select aria-label="Operador" value={f.operador} onChange={(e) => cambiar(i, { operador: e.target.value as Operador })} className={`${CAMPO} max-w-28`}>
              {OPERADORES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <input aria-label="Valor" value={f.valor} disabled={SIN_VALOR.includes(f.operador)} onChange={(e) => cambiar(i, { valor: e.target.value })} className={CAMPO} />
            <Quitar etiqueta="Quitar filtro" onClick={() => alCambiar(filtros.filter((_, j) => j !== i))} />
          </div>
        ))
      )}
    </Bloque>
  );
}

type Props = {
  esquemas: Esquema[];
  esquemaInicial: string | null;
  tablaInicial: string | null;
  alCambiar: (peticion: PeticionConsulta | null) => void;
  alCerrar: () => void;
};

export function ConstructorFlotante({ esquemas, esquemaInicial, tablaInicial, alCambiar, alCerrar }: Props) {
  const [tipo, setTipo] = useState<TipoConsulta>("SELECT");
  const [nombreEsquema, setNombreEsquema] = useState<string | null>(esquemaInicial ?? esquemas[0]?.nombre ?? null);
  const [nombreTabla, setNombreTabla] = useState<string | null>(tablaInicial);
  const [columnas, setColumnas] = useState<string[]>([]);
  const [uniones, setUniones] = useState<Union[]>([]);
  const [filtros, setFiltros] = useState<Filtro[]>([]);
  const [orden, setOrden] = useState<Orden | null>(null);
  const [limite, setLimite] = useState(1000);
  const [valoresInsert, setValoresInsert] = useState<Record<string, string>>({});
  const [valoresUpdate, setValoresUpdate] = useState<Asignacion[]>([]);
  const [posicion, setPosicion] = useState<{ x: number; y: number } | null>(null);
  const arrastre = useRef<{ dx: number; dy: number } | null>(null);
  const ventana = useRef<HTMLDivElement>(null);

  const esquema = esquemas.find((e) => e.nombre === nombreEsquema) ?? null;
  const tabla = esquema?.tablas.find((t) => t.nombre === nombreTabla) ?? null;
  const columnasBase = tabla?.columnas.map((c) => c.nombre) ?? [];

  const relacionesTabla = useMemo(
    () => relacionesDe(esquema).filter((r) => tabla && (r.origen === tabla.nombre || r.destino === tabla.nombre)),
    [esquema, tabla]
  );

  const columnasDisponibles = useMemo(() => {
    if (!tabla || !esquema) return [];
    const nombres = [tabla.nombre, ...uniones.map((u) => (u.relacion.origen === tabla.nombre ? u.relacion.destino : u.relacion.origen))];
    return nombres.flatMap((n) => esquema.tablas.find((t) => t.nombre === n)?.columnas.map((c) => `${n}.${c.nombre}`) ?? []);
  }, [esquema, tabla, uniones]);

  useEffect(() => {
    setNombreTabla(tablaInicial);
    if (esquemaInicial) setNombreEsquema(esquemaInicial);
  }, [esquemaInicial, tablaInicial]);

  useEffect(() => {
    if (!esquema || !tabla) {
      alCambiar(null);
      return;
    }
    const base = { esquema: esquema.nombre, tabla: tabla.nombre };
    if (tipo === "SELECT") alCambiar({ tipo, ...base, columnas, uniones, filtros, orden, limite });
    if (tipo === "INSERT")
      alCambiar({
        tipo,
        ...base,
        valores: Object.entries(valoresInsert)
          .filter(([, v]) => v !== "")
          .map(([columna, valor]) => ({ columna, valor })),
      });
    if (tipo === "UPDATE") alCambiar({ tipo, ...base, valores: valoresUpdate, filtros });
    if (tipo === "DELETE") alCambiar({ tipo, ...base, filtros });
  }, [tipo, esquema, tabla, columnas, uniones, filtros, orden, limite, valoresInsert, valoresUpdate, alCambiar]);

  const elegirTabla = (nombre: string) => {
    setNombreTabla(nombre || null);
    setColumnas([]);
    setUniones([]);
    setFiltros([]);
    setOrden(null);
    setValoresInsert({});
    setValoresUpdate([]);
  };

  const iniciarArrastre = (e: React.PointerEvent) => {
    const caja = ventana.current?.getBoundingClientRect();
    if (!caja) return;
    arrastre.current = { dx: e.clientX - caja.left, dy: e.clientY - caja.top };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const mover = (e: React.PointerEvent) => {
    if (!arrastre.current) return;
    setPosicion({
      x: Math.max(0, Math.min(window.innerWidth - 120, e.clientX - arrastre.current.dx)),
      y: Math.max(0, Math.min(window.innerHeight - 48, e.clientY - arrastre.current.dy)),
    });
  };
  const soltar = () => {
    arrastre.current = null;
  };

  const columnasFiltro = tipo === "SELECT" ? columnasDisponibles : columnasBase;

  return (
    <div
      ref={ventana}
      role="dialog"
      aria-labelledby="titulo-constructor"
      className="bisel-panel fixed z-40 flex max-h-[70vh] w-[min(440px,92vw)] flex-col border-[3px] border-black bg-mc-panel text-mc-tinta shadow-[6px_6px_0_rgba(0,0,0,0.45)]"
      style={posicion ? { left: posicion.x, top: posicion.y } : { right: 24, bottom: 24 }}
    >
      <div
        onPointerDown={iniciarArrastre}
        onPointerMove={mover}
        onPointerUp={soltar}
        className="textura-tablones flex cursor-move touch-none select-none items-center justify-between gap-2 border-b-[3px] border-black px-3 py-1.5"
      >
        <h2 id="titulo-constructor" className="font-pixel text-lg text-mc-tablon-tinta">
          Constructor de consultas
        </h2>
        <button
          type="button"
          aria-label="Cerrar constructor"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={alCerrar}
          className="bisel-boton h-8 w-8 border-2 border-black bg-mc-boton text-lg text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto p-3">
        <div role="group" aria-label="Tipo de consulta" className="grid grid-cols-4 gap-1.5">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === tipo}
              onClick={() => setTipo(t)}
              className={`h-9 border-2 border-black text-xl ${t === tipo ? "bisel-boton bg-mc-seleccion text-white" : "bisel-boton bg-mc-boton text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="constructor-tabla" className="font-pixel text-base">
            Tabla
          </label>
          <select
            id="constructor-tabla"
            value={tabla?.nombre ?? ""}
            disabled={!esquema || esquema.tablas.length === 0}
            onChange={(e) => elegirTabla(e.target.value)}
            className={CAMPO}
          >
            <option value="">{esquema && esquema.tablas.length > 0 ? "—" : "Sin tablas"}</option>
            {esquema?.tablas.map((t) => (
              <option key={t.nombre}>{t.nombre}</option>
            ))}
          </select>
        </div>

        {tipo === "SELECT" && (
          <>
            <Bloque titulo="Columnas">
              {columnasDisponibles.length === 0 ? (
                <EstadoVacio texto="Sin columnas" tono="claro" className="py-0 text-lg" />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" aria-pressed={columnas.length === 0} onClick={() => setColumnas([])} className={columnas.length === 0 ? CHIP_ACTIVO : CHIP}>
                    *
                  </button>
                  {columnasDisponibles.map((c) => {
                    const activa = columnas.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={activa}
                        onClick={() => setColumnas(activa ? columnas.filter((x) => x !== c) : [...columnas, c])}
                        className={activa ? CHIP_ACTIVO : CHIP}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              )}
            </Bloque>

            <Bloque
              titulo="JOIN"
              accion={
                <button
                  type="button"
                  className={BOTON}
                  disabled={relacionesTabla.length === 0}
                  onClick={() => setUniones([...uniones, { relacion: relacionesTabla[0], tipo: "INNER" }])}
                >
                  + JOIN
                </button>
              }
            >
              {uniones.length === 0 ? (
                <EstadoVacio texto="Sin uniones" tono="claro" className="py-0 text-lg" />
              ) : (
                uniones.map((u, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <select
                      aria-label="Tipo de unión"
                      value={u.tipo}
                      onChange={(e) => setUniones(uniones.map((x, j) => (j === i ? { ...x, tipo: e.target.value as Union["tipo"] } : x)))}
                      className={`${CAMPO} max-w-20`}
                    >
                      <option>INNER</option>
                      <option>LEFT</option>
                    </select>
                    <select
                      aria-label="Relación"
                      value={relacionesTabla.indexOf(u.relacion)}
                      onChange={(e) => setUniones(uniones.map((x, j) => (j === i ? { ...x, relacion: relacionesTabla[Number(e.target.value)] } : x)))}
                      className={CAMPO}
                    >
                      {relacionesTabla.map((r, k) => (
                        <option key={k} value={k}>
                          {r.origen}.{r.columna} → {r.destino}.{r.columnaDestino}
                        </option>
                      ))}
                    </select>
                    <Quitar etiqueta="Quitar unión" onClick={() => setUniones(uniones.filter((_, j) => j !== i))} />
                  </div>
                ))
              )}
            </Bloque>

            <Filtros columnas={columnasFiltro} filtros={filtros} alCambiar={setFiltros} />

            <Bloque titulo="ORDER BY · LIMIT">
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Ordenar por"
                  value={orden?.columna ?? ""}
                  onChange={(e) => setOrden(e.target.value ? { columna: e.target.value, direccion: orden?.direccion ?? "ASC" } : null)}
                  className={CAMPO}
                >
                  <option value="">—</option>
                  {columnasDisponibles.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className={BOTON}
                  disabled={!orden}
                  onClick={() => orden && setOrden({ ...orden, direccion: orden.direccion === "ASC" ? "DESC" : "ASC" })}
                >
                  {orden?.direccion ?? "ASC"}
                </button>
                <input
                  aria-label="LIMIT"
                  type="number"
                  min={1}
                  value={limite}
                  onChange={(e) => setLimite(Math.max(1, Number(e.target.value) || 1))}
                  className={`${CAMPO} max-w-20`}
                />
              </div>
            </Bloque>
          </>
        )}

        {tipo === "INSERT" && (
          <Bloque titulo="VALUES">
            {!tabla ? (
              <EstadoVacio texto="Sin columnas" tono="claro" className="py-0 text-lg" />
            ) : (
              <div className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-center gap-1.5">
                {tabla.columnas.map((c) => (
                  <label key={c.nombre} className="contents">
                    <span className="truncate text-lg">{c.nombre}</span>
                    <input
                      value={valoresInsert[c.nombre] ?? ""}
                      placeholder={c.autoIncremento ? "AUTO" : c.tipo}
                      onChange={(e) => setValoresInsert({ ...valoresInsert, [c.nombre]: e.target.value })}
                      className={CAMPO}
                    />
                  </label>
                ))}
              </div>
            )}
          </Bloque>
        )}

        {tipo === "UPDATE" && (
          <>
            <Bloque
              titulo="SET"
              accion={
                <button
                  type="button"
                  className={BOTON}
                  disabled={columnasBase.length === 0}
                  onClick={() => setValoresUpdate([...valoresUpdate, { columna: columnasBase[0], valor: "" }])}
                >
                  + Columna
                </button>
              }
            >
              {valoresUpdate.length === 0 ? (
                <EstadoVacio texto="Sin cambios" tono="claro" className="py-0 text-lg" />
              ) : (
                valoresUpdate.map((v, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <select
                      aria-label="Columna"
                      value={v.columna}
                      onChange={(e) => setValoresUpdate(valoresUpdate.map((x, j) => (j === i ? { ...x, columna: e.target.value } : x)))}
                      className={CAMPO}
                    >
                      {columnasBase.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <span className="text-lg">=</span>
                    <input
                      aria-label="Valor"
                      value={v.valor}
                      onChange={(e) => setValoresUpdate(valoresUpdate.map((x, j) => (j === i ? { ...x, valor: e.target.value } : x)))}
                      className={CAMPO}
                    />
                    <Quitar etiqueta="Quitar columna" onClick={() => setValoresUpdate(valoresUpdate.filter((_, j) => j !== i))} />
                  </div>
                ))
              )}
            </Bloque>
            <Filtros columnas={columnasFiltro} filtros={filtros} alCambiar={setFiltros} />
          </>
        )}

        {tipo === "DELETE" && <Filtros columnas={columnasFiltro} filtros={filtros} alCambiar={setFiltros} />}
      </div>
    </div>
  );
}
