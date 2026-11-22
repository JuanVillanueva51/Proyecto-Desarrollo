"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ejecutarConsulta, previsualizarSql } from "@/lib/datos/acciones";
import { confirmar } from "@/lib/eventos";
import type { EntradaSalida, Esquema, EstadoEditor, PeticionConsulta, ResultadoConsulta } from "@/lib/datos/tipos";
import { ConstructorFlotante } from "../consultas/ConstructorFlotante";
import { BarraHerramientasSql } from "./BarraHerramientasSql";
import { EditorSoloLectura } from "./EditorSoloLectura";
import { PanelSalida } from "./PanelSalida";
import { TablaResultados } from "./TablaResultados";

type Props = {
  conexionId: string;
  esquemas: Esquema[];
  esquemaActivo: string | null;
  tablaActiva: string | null;
  estadoInicial: EstadoEditor;
  navegador: React.ReactNode;
  ayuda: React.ReactNode;
};

export function EspacioEditor({ conexionId, esquemas, esquemaActivo, tablaActiva, estadoInicial, navegador, ayuda }: Props) {
  const [abierto, setAbierto] = useState(true);
  const [sql, setSql] = useState(estadoInicial.sql);
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(estadoInicial.resultado);
  const [salida, setSalida] = useState<EntradaSalida[]>(estadoInicial.salida);
  const [peticion, setPeticion] = useState<PeticionConsulta | null>(null);
  const [pendiente, iniciar] = useTransition();
  const turno = useRef(0);

  const alCambiar = useCallback((nueva: PeticionConsulta | null) => setPeticion(nueva), []);

  useEffect(() => {
    if (!peticion) return;
    const mio = ++turno.current;
    previsualizarSql(peticion).then((texto) => {
      if (mio === turno.current) setSql(texto);
    });
  }, [peticion]);

  const ejecutar = async () => {
    if (!peticion) return;
    if ((peticion.tipo === "DELETE" || peticion.tipo === "UPDATE") && peticion.filtros.length === 0) {
      const seguir = await confirmar({
        titulo: `${peticion.tipo} sin WHERE`,
        mensaje: `Afectará todas las filas de ${peticion.tabla}.`,
        confirmar: "Ejecutar",
        peligro: true,
      });
      if (!seguir) return;
    }
    iniciar(async () => {
      const respuesta = await ejecutarConsulta(conexionId, peticion);
      if (respuesta.sql) setSql(respuesta.sql);
      setResultado(respuesta.resultado);
      if (respuesta.salida) setSalida((s) => [...s, respuesta.salida!]);
    });
  };

  const pestanas = tablaActiva ? ["Query 1", tablaActiva] : ["Query 1"];

  return (
    <>
      <BarraHerramientasSql
        constructorAbierto={abierto}
        alAlternarConstructor={() => setAbierto((a) => !a)}
        alEjecutar={ejecutar}
        puedeEjecutar={!!peticion && !pendiente}
      />
      <div className="flex flex-1 flex-col md:flex-row md:flex-wrap lg:flex-nowrap">
        {navegador}
        <main className="flex min-w-0 flex-1 flex-col">
          <EditorSoloLectura sql={sql} pestanas={pestanas} />
          <TablaResultados resultado={resultado} />
          <PanelSalida salida={salida} />
        </main>
        {ayuda}
      </div>
      {abierto && (
        <ConstructorFlotante
          esquemas={esquemas}
          esquemaInicial={esquemaActivo}
          tablaInicial={tablaActiva}
          alCambiar={alCambiar}
          alCerrar={() => setAbierto(false)}
        />
      )}
    </>
  );
}
