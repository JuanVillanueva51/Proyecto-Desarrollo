import type { Esquema, Relacion, Tabla } from "./tipos";

const COLORES_TABLA = ["#5bc8e6", "#ff5555", "#ffaa00", "#aa78ff", "#ffff55", "#55ff55", "#ff8ad8", "#8ad0ff"];

export function colorTabla(indice: number): string {
  return COLORES_TABLA[indice % COLORES_TABLA.length];
}

export function relacionesDe(esquema: Esquema | null): Relacion[] {
  if (!esquema) return [];
  const nombres = new Set(esquema.tablas.map((t) => t.nombre));
  return esquema.tablas.flatMap((tabla) =>
    tabla.columnas
      .filter((c) => c.referencia && nombres.has(c.referencia.tabla))
      .map((c) => ({
        origen: tabla.nombre,
        columna: c.nombre,
        destino: c.referencia!.tabla,
        columnaDestino: c.referencia!.columna,
      }))
  );
}

export function nivelesDe(esquema: Esquema): Map<string, number> {
  const porNombre = new Map(esquema.tablas.map((t) => [t.nombre, t]));
  const niveles = new Map<string, number>();
  const visitando = new Set<string>();

  const calcular = (tabla: Tabla): number => {
    const conocido = niveles.get(tabla.nombre);
    if (conocido !== undefined) return conocido;
    if (visitando.has(tabla.nombre)) return 0;
    visitando.add(tabla.nombre);
    let nivel = 0;
    for (const columna of tabla.columnas) {
      const destino = columna.referencia ? porNombre.get(columna.referencia.tabla) : undefined;
      if (destino && destino.nombre !== tabla.nombre) nivel = Math.max(nivel, calcular(destino) + 1);
    }
    visitando.delete(tabla.nombre);
    niveles.set(tabla.nombre, nivel);
    return nivel;
  };

  esquema.tablas.forEach(calcular);
  return niveles;
}
