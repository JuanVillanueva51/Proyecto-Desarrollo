"use server";

import {
  actualizarConexion,
  analizarArchivo,
  comprobarConexion,
  construirSql,
  crearBase,
  duplicarConexion as duplicarEnFuente,
  eliminarConexion as eliminarEnFuente,
  enviarConsulta,
  exportarBase,
  guardarTabla,
  obtenerEsquemas,
  registrarConexion,
} from "./fuente";
import { leerFormularioConexion } from "./formularios";
import type {
  ArchivoExportado,
  EntradaSalida,
  Esquema,
  OpcionesExportacion,
  PeticionConsulta,
  RespuestaConsulta,
  Tabla,
} from "./tipos";

export async function guardarConexion(formulario: FormData): Promise<void> {
  const id = formulario.get("id");
  const datos = leerFormularioConexion(formulario);
  if (typeof id === "string" && id) await actualizarConexion(id, datos);
  else await registrarConexion(datos);
}

export async function probarConexion(formulario: FormData): Promise<boolean> {
  return comprobarConexion(leerFormularioConexion(formulario));
}

export async function eliminarConexion(id: string): Promise<void> {
  await eliminarEnFuente(id);
}

export async function duplicarConexion(id: string): Promise<void> {
  await duplicarEnFuente(id);
}

export async function listarEsquemas(conexionId: string): Promise<Esquema[]> {
  return obtenerEsquemas(conexionId);
}

export async function previsualizarSql(peticion: PeticionConsulta): Promise<string> {
  return construirSql(peticion);
}

export async function ejecutarConsulta(
  conexionId: string,
  peticion: PeticionConsulta
): Promise<RespuestaConsulta> {
  return enviarConsulta(conexionId, peticion);
}

async function leerArchivo(formulario: FormData): Promise<{ nombre: string; contenido: string } | null> {
  const archivo = formulario.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) return null;
  return { nombre: archivo.name, contenido: await archivo.text() };
}

export async function analizarImportacion(formulario: FormData): Promise<Esquema | null> {
  const archivo = await leerArchivo(formulario);
  return archivo ? analizarArchivo(archivo.nombre, archivo.contenido) : null;
}

export async function crearBaseDesdeArchivo(formulario: FormData): Promise<EntradaSalida[]> {
  const archivo = await leerArchivo(formulario);
  const conexionId = formulario.get("conexion");
  const nombreBase = formulario.get("nombreBase");
  if (!archivo || typeof conexionId !== "string" || typeof nombreBase !== "string") return [];
  return crearBase(conexionId, nombreBase.trim(), archivo.contenido, formulario.has("reemplazar"));
}

export async function aplicarCambiosTabla(
  conexionId: string,
  esquema: string,
  tablaOriginal: string,
  tabla: Tabla
): Promise<EntradaSalida | null> {
  return guardarTabla(conexionId, esquema, tablaOriginal, tabla);
}

export async function exportar(opciones: OpcionesExportacion): Promise<ArchivoExportado | null> {
  return exportarBase(opciones);
}
