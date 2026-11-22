import { colorTabla, nivelesDe, relacionesDe } from "@/lib/datos/esquema";
import type { Esquema, Relacion, Tabla } from "@/lib/datos/tipos";

export type Punto = { x: number; y: number };

export type NodoTabla = Punto & { tabla: Tabla; color: string };

export type DisenoMisiones = {
  ancho: number;
  alto: number;
  raiz: Punto;
  menores: (Punto & { etiqueta: string; color: string })[];
  nodos: NodoTabla[];
  relaciones: Relacion[];
};

export type TarjetaClasica = Punto & { tabla: Tabla; color: string; ancho: number; alto: number };

export type DisenoClasico = {
  ancho: number;
  alto: number;
  tarjetas: TarjetaClasica[];
  relaciones: Relacion[];
};

export const RADIO_NODO = 30;

function ordenarPorNivel(esquema: Esquema) {
  const niveles = nivelesDe(esquema);
  const filas = new Map<number, { tabla: Tabla; color: string }[]>();
  esquema.tablas.forEach((tabla, i) => {
    const nivel = niveles.get(tabla.nombre) ?? 0;
    const fila = filas.get(nivel) ?? [];
    fila.push({ tabla, color: colorTabla(i) });
    filas.set(nivel, fila);
  });
  return [...filas.entries()].sort((a, b) => a[0] - b[0]).map(([, fila]) => fila);
}

export function disenarMisiones(esquema: Esquema): DisenoMisiones {
  const filas = ordenarPorNivel(esquema);
  const maximo = Math.max(1, ...filas.map((f) => f.length));
  const ancho = Math.max(860, maximo * 210 + 80);
  const inicioTablas = 270;
  const alto = inicioTablas + Math.max(0, filas.length - 1) * 170 + 110;

  const nodos: NodoTabla[] = filas.flatMap((fila, nivel) =>
    fila.map((item, i) => ({
      ...item,
      x: Math.round(((i + 0.5) * ancho) / fila.length),
      y: inicioTablas + nivel * 170,
    }))
  );

  const raiz = { x: Math.round(ancho / 2), y: 70 };
  const categorias = [
    { etiqueta: "Triggers", color: "#ff6b6b" },
    { etiqueta: "Vistas", color: "#9ad7ea" },
    { etiqueta: "Rutinas", color: "#e8dcc0" },
  ];
  const menores = categorias.map((c, i) => ({
    ...c,
    x: raiz.x + (i - 1) * 190 + (i === 1 ? 0 : (i - 1) * 40),
    y: 165,
  }));

  return { ancho, alto, raiz, menores, nodos, relaciones: relacionesDe(esquema) };
}

export function altoTarjeta(tabla: Tabla): number {
  return 40 + Math.max(1, tabla.columnas.length) * 26 + 14;
}

export function disenarClasico(esquema: Esquema): DisenoClasico {
  const filas = ordenarPorNivel(esquema).flat();
  const columnas = 3;
  const anchoTarjeta = 240;
  const separacionX = 110;
  const separacionY = 80;
  const tarjetas: TarjetaClasica[] = [];
  let y = 40;

  for (let i = 0; i < filas.length; i += columnas) {
    const fila = filas.slice(i, i + columnas);
    const altoFila = Math.max(...fila.map((f) => altoTarjeta(f.tabla)));
    fila.forEach((item, j) => {
      tarjetas.push({
        ...item,
        x: 40 + j * (anchoTarjeta + separacionX),
        y,
        ancho: anchoTarjeta,
        alto: altoTarjeta(item.tabla),
      });
    });
    y += altoFila + separacionY;
  }

  const usadas = Math.min(columnas, Math.max(1, filas.length));
  return {
    ancho: 40 + usadas * (anchoTarjeta + separacionX),
    alto: Math.max(y, 200),
    tarjetas,
    relaciones: relacionesDe(esquema),
  };
}
