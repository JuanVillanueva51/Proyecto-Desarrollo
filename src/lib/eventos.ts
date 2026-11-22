import type { Conexion, Esquema, Tabla } from "./datos/tipos";

export type OpcionesConfirmacion = {
  titulo: string;
  mensaje: string;
  confirmar?: string;
  peligro?: boolean;
};

export type DatosVentana = {
  configuracion: undefined;
  importar: { conexionId?: string } | undefined;
  conexiones: undefined;
  conexion: { conexion?: Conexion } | undefined;
  exportar: { conexionId?: string; esquema?: string } | undefined;
  "editor-tabla": { conexionId: string; esquema: Esquema; tabla: Tabla };
  confirmacion: OpcionesConfirmacion & { resolver: (aceptado: boolean) => void };
};

export type NombreVentana = keyof DatosVentana;

export type Aviso = {
  tipo: "exito" | "error" | "info";
  texto: string;
};

export const EVENTO_VENTANA = "mcql:ventana";
export const EVENTO_AVISO = "mcql:aviso";

export type DetalleVentana = { nombre: NombreVentana; datos: unknown };

export function abrirVentana<K extends NombreVentana>(nombre: K, datos?: DatosVentana[K]) {
  window.dispatchEvent(new CustomEvent<DetalleVentana>(EVENTO_VENTANA, { detail: { nombre, datos } }));
}

export function abrirConfiguracion() {
  abrirVentana("configuracion");
}

export function confirmar(opciones: OpcionesConfirmacion): Promise<boolean> {
  return new Promise((resolver) => abrirVentana("confirmacion", { ...opciones, resolver }));
}

export function avisar(aviso: Aviso) {
  window.dispatchEvent(new CustomEvent<Aviso>(EVENTO_AVISO, { detail: aviso }));
}
