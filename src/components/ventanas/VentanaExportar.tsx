"use client";

import { useEffect, useState, useTransition } from "react";
import { exportar, listarEsquemas } from "@/lib/datos/acciones";
import type { Conexion, Esquema, FormatoExportacion } from "@/lib/datos/tipos";
import { avisar } from "@/lib/eventos";
import { BotonMc } from "../BotonMc";
import { CAMPO } from "../FilaCampo";
import { Ventana } from "../Ventana";

function descargar(nombre: string, contenido: string, formato: FormatoExportacion) {
  const tipo = formato === "json" ? "application/json" : "application/sql";
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

function Contenido({
  conexiones,
  inicial,
  cerrar,
}: {
  conexiones: Conexion[];
  inicial?: { conexionId?: string; esquema?: string };
  cerrar: () => void;
}) {
  const [conexion, setConexion] = useState(inicial?.conexionId ?? conexiones[0]?.id ?? "");
  const [esquemas, setEsquemas] = useState<Esquema[]>([]);
  const [esquema, setEsquema] = useState(inicial?.esquema ?? "");
  const [formato, setFormato] = useState<FormatoExportacion>("json");
  const [estructura, setEstructura] = useState(true);
  const [datos, setDatos] = useState(true);
  const [nombre, setNombre] = useState("");
  const [pendiente, iniciar] = useTransition();

  useEffect(() => {
    if (!conexion) return;
    let vigente = true;
    listarEsquemas(conexion).then((lista) => {
      if (!vigente) return;
      setEsquemas(lista);
      setEsquema((actual) => (lista.some((e) => e.nombre === actual) ? actual : lista[0]?.nombre ?? ""));
    });
    return () => {
      vigente = false;
    };
  }, [conexion]);

  const nombreFinal = nombre.trim() || `${esquema || "base"}.${formato}`;
  const listo = !!conexion && !!esquema && (estructura || datos) && !pendiente;

  const ejecutar = () =>
    iniciar(async () => {
      const archivo = await exportar({ conexionId: conexion, esquema, formato, estructura, datos, nombreArchivo: nombreFinal });
      if (!archivo) return;
      descargar(archivo.nombreArchivo, archivo.contenido, formato);
      avisar({ tipo: "exito", texto: `Exportado: ${archivo.nombreArchivo}` });
    });

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="grid grid-cols-1 items-center gap-x-3 gap-y-3 md:grid-cols-[150px_minmax(0,1fr)]">
        <label htmlFor="exportar-conexion" className="text-xl md:text-right">
          Conexión:
        </label>
        <select id="exportar-conexion" value={conexion} disabled={conexiones.length === 0} onChange={(e) => setConexion(e.target.value)} className={CAMPO}>
          {conexiones.length === 0 && <option value="">Sin conexiones</option>}
          {conexiones.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="exportar-esquema" className="text-xl md:text-right">
          Esquema:
        </label>
        <select id="exportar-esquema" value={esquema} disabled={esquemas.length === 0} onChange={(e) => setEsquema(e.target.value)} className={CAMPO}>
          {esquemas.length === 0 && <option value="">Sin esquemas</option>}
          {esquemas.map((e) => (
            <option key={e.nombre}>{e.nombre}</option>
          ))}
        </select>
        <span className="text-xl md:text-right">Formato:</span>
        <div role="radiogroup" aria-label="Formato" className="flex gap-2">
          {(["json", "sql"] as const).map((f) => (
            <BotonMc key={f} variante={formato === f ? "seleccionado" : "oscuro"} aria-pressed={formato === f} onClick={() => setFormato(f)} className="w-24">
              {f.toUpperCase()}
            </BotonMc>
          ))}
        </div>
        <span className="text-xl md:text-right">Incluir:</span>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-xl">
            <input type="checkbox" checked={estructura} onChange={(e) => setEstructura(e.target.checked)} className="h-5 w-5 accent-mc-seleccion" />
            Estructura
          </label>
          <label className="flex items-center gap-2 text-xl">
            <input type="checkbox" checked={datos} onChange={(e) => setDatos(e.target.checked)} className="h-5 w-5 accent-mc-seleccion" />
            Datos
          </label>
        </div>
        <label htmlFor="exportar-nombre" className="text-xl md:text-right">
          Archivo:
        </label>
        <input id="exportar-nombre" value={nombre} placeholder={nombreFinal} onChange={(e) => setNombre(e.target.value)} className={`${CAMPO} placeholder:text-[#9a9a9a]`} />
      </div>

      <div className="flex justify-end gap-3">
        <BotonMc variante="claro" onClick={cerrar}>
          Cancelar
        </BotonMc>
        <BotonMc variante="confirmar" onClick={ejecutar} disabled={!listo}>
          Exportar
        </BotonMc>
      </div>
    </div>
  );
}

export function VentanaExportar({ conexiones }: { conexiones: Conexion[] }) {
  return (
    <Ventana nombre="exportar" titulo="Data Export" ancho="w-[min(640px,94vw)]">
      {(inicial, cerrar) => <Contenido conexiones={conexiones} inicial={inicial} cerrar={cerrar} />}
    </Ventana>
  );
}
