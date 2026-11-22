import type {
  ArchivoExportado,
  Conexion,
  EntradaSalida,
  Esquema,
  EstadoEditor,
  NuevaConexion,
  OpcionesExportacion,
  PeticionConsulta,
  RespuestaConsulta,
  Tabla,
} from "./tipos";

export async function obtenerConexiones(): Promise<Conexion[]> {
  return [];
}

export async function obtenerConexion(_id: string): Promise<Conexion | null> {
  return null;
}

export async function registrarConexion(_datos: NuevaConexion): Promise<void> {}

export async function actualizarConexion(_id: string, _datos: NuevaConexion): Promise<void> {}

export async function eliminarConexion(_id: string): Promise<void> {}

export async function duplicarConexion(_id: string): Promise<void> {}

export async function comprobarConexion(_datos: NuevaConexion): Promise<boolean> {
  return false;
}

export async function obtenerEsquemas(_conexionId: string): Promise<Esquema[]> {
  return [];
}

export async function obtenerEstadoEditor(_conexionId: string): Promise<EstadoEditor> {
  return { sql: "", resultado: null, salida: [] };
}

export async function construirSql(_peticion: PeticionConsulta): Promise<string> {
  return "";
}

export async function enviarConsulta(
  _conexionId: string,
  _peticion: PeticionConsulta
): Promise<RespuestaConsulta> {
  return { sql: "", resultado: null, salida: null };
}

export async function analizarArchivo(_nombre: string, _contenido: string): Promise<Esquema | null> {
  return null;
}

export async function crearBase(
  _conexionId: string,
  _nombreBase: string,
  _contenido: string,
  _reemplazar: boolean
): Promise<EntradaSalida[]> {
  return [];
}

export async function guardarTabla(
  _conexionId: string,
  _esquema: string,
  _tablaOriginal: string,
  _tabla: Tabla
): Promise<EntradaSalida | null> {
  return null;
}

export async function exportarBase(_opciones: OpcionesExportacion): Promise<ArchivoExportado | null> {
  return null;
}
