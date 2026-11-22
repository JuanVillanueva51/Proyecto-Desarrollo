"use client";

import { useRef, useState, useTransition } from "react";
import { analizarImportacion, crearBaseDesdeArchivo } from "@/lib/datos/acciones";
import { colorTabla, relacionesDe } from "@/lib/datos/esquema";
import type { Conexion, EntradaSalida, Esquema } from "@/lib/datos/tipos";
import { avisar, confirmar } from "@/lib/eventos";
import { BotonMc } from "../BotonMc";
import { EstadoVacio } from "../EstadoVacio";
import { CAMPO } from "../FilaCampo";
import { Cofre, IconoTabla } from "../IconosPixel";
import { PanelSalida } from "../sql/PanelSalida";
import { Ventana } from "../Ventana";

function Contenido({ conexiones, conexionInicial, cerrar }: { conexiones: Conexion[]; conexionInicial?: string; cerrar: () => void }) {
  const formulario = useRef<HTMLFormElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<string | null>(null);
  const [vista, setVista] = useState<Esquema | null>(null);
  const [conexion, setConexion] = useState(conexionInicial ?? conexiones[0]?.id ?? "");
  const [nombreBase, setNombreBase] = useState("");
  const [salida, setSalida] = useState<EntradaSalida[]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [pendiente, iniciar] = useTransition();

  const analizar = () => {
    const archivoElegido = entrada.current?.files?.[0];
    setArchivo(archivoElegido?.name ?? null);
    if (!archivoElegido || !formulario.current) return;
    if (!nombreBase) setNombreBase(archivoElegido.name.replace(/\.[^.]+$/, ""));
    const datos = new FormData(formulario.current);
    iniciar(async () => setVista(await analizarImportacion(datos)));
  };

  const crear = async () => {
    if (!formulario.current) return;
    const datos = new FormData(formulario.current);
    if (datos.has("reemplazar")) {
      const seguir = await confirmar({
        titulo: "Reemplazar base",
        mensaje: `Si ${nombreBase} ya existe, se borrará con todos sus datos.`,
        confirmar: "Reemplazar",
        peligro: true,
      });
      if (!seguir) return;
    }
    iniciar(async () => {
      const resultado = await crearBaseDesdeArchivo(datos);
      setSalida((s) => [...s, ...resultado]);
      const ultima = resultado.at(-1);
      if (ultima) avisar({ tipo: ultima.correcto ? "exito" : "error", texto: ultima.mensaje });
    });
  };

  const relaciones = relacionesDe(vista);
  const listo = !!archivo && !!conexion && !!nombreBase.trim() && !pendiente;

  return (
    <form ref={formulario} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 p-5">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          if (entrada.current && e.dataTransfer.files.length) {
            entrada.current.files = e.dataTransfer.files;
            analizar();
          }
        }}
        className={`presionable flex cursor-pointer flex-col items-center gap-2 border-[3px] border-dashed border-black px-4 py-6 text-center ${
          arrastrando ? "bg-mc-seleccion text-white" : "bisel-casilla bg-mc-casilla"
        }`}
      >
        <Cofre tamano={44} />
        <span className="text-xl">{archivo ?? "Elegir archivo (.json, .sql)"}</span>
        <input ref={entrada} name="archivo" type="file" accept=".json,.sql,application/json" onChange={analizar} className="sr-only" />
      </label>

      <div className="grid grid-cols-1 items-center gap-x-3 gap-y-3 md:grid-cols-[150px_minmax(0,1fr)]">
        <label htmlFor="importar-conexion" className="text-xl md:text-right">
          Conexión:
        </label>
        <select
          id="importar-conexion"
          name="conexion"
          value={conexion}
          disabled={conexiones.length === 0}
          onChange={(e) => setConexion(e.target.value)}
          className={CAMPO}
        >
          {conexiones.length === 0 && <option value="">Sin conexiones</option>}
          {conexiones.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="importar-nombre" className="text-xl md:text-right">
          Nombre de la base:
        </label>
        <input id="importar-nombre" name="nombreBase" value={nombreBase} onChange={(e) => setNombreBase(e.target.value)} className={CAMPO} />
        <span aria-hidden="true" />
        <label htmlFor="importar-reemplazar" className="flex items-center gap-2 text-xl">
          <input id="importar-reemplazar" name="reemplazar" type="checkbox" className="h-5 w-5 accent-mc-seleccion" />
          Reemplazar si existe
        </label>
      </div>

      <section aria-label="Vista previa" className="bisel-casilla max-h-56 overflow-auto bg-mc-consola p-3 text-white">
        <h3 className="mb-2 font-pixel text-base text-mc-oro">Vista previa</h3>
        {!vista ? (
          <EstadoVacio texto={pendiente ? "Analizando..." : "Sin vista previa"} className="py-2" />
        ) : (
          <>
            <p className="mb-2 text-lg text-mc-suave">
              {vista.nombre} · {vista.tablas.length} tablas · {relaciones.length} relaciones
            </p>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {vista.tablas.map((t, i) => (
                <li key={t.nombre} className="flex items-center gap-2 text-xl">
                  <IconoTabla color={colorTabla(i)} />
                  <span className="flex-1 truncate">{t.nombre}</span>
                  <span className="text-mc-suave">{t.columnas.length}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="-mx-5 border-y-[3px] border-black">
        <PanelSalida salida={salida} />
      </div>

      <div className="flex justify-end gap-3">
        <BotonMc variante="claro" onClick={cerrar}>
          Cancelar
        </BotonMc>
        <BotonMc variante="confirmar" onClick={crear} disabled={!listo}>
          Crear base
        </BotonMc>
      </div>
    </form>
  );
}

export function VentanaImportar({ conexiones }: { conexiones: Conexion[] }) {
  return (
    <Ventana nombre="importar" titulo="Importar JSON · Crear base" ancho="w-[min(780px,94vw)]">
      {(datos, cerrar) => <Contenido conexiones={conexiones} conexionInicial={datos?.conexionId} cerrar={cerrar} />}
    </Ventana>
  );
}
