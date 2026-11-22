export type Conexion = {
  id: string;
  nombre: string;
  usuario: string;
  host: string;
  puerto: number;
  esquemaPorDefecto: string | null;
};

export type ConfiguracionSsl = {
  modo: string;
  llave: string;
  certificado: string;
  autoridad: string;
  cifrado: string;
};

export type ConfiguracionAvanzada = {
  compresion: boolean;
  comillasAnsi: boolean;
  textoPlano: boolean;
  tiempoEspera: number;
  modoSql: string;
  otros: string;
};

export type NuevaConexion = Omit<Conexion, "id"> & {
  metodo: string;
  ssl: ConfiguracionSsl;
  avanzado: ConfiguracionAvanzada;
};

export type Referencia = {
  tabla: string;
  columna: string;
};

export type Columna = {
  nombre: string;
  tipo: string;
  llavePrimaria: boolean;
  autoIncremento: boolean;
  nulo: boolean;
  referencia: Referencia | null;
};

export type Indice = {
  nombre: string;
  columnas: string[];
  unico: boolean;
};

export type Tabla = {
  nombre: string;
  motor: string | null;
  descripcion: string | null;
  columnas: Columna[];
  indices: Indice[];
};

export type Esquema = {
  nombre: string;
  tablas: Tabla[];
  vistas: string[];
  rutinas: string[];
  disparadores: string[];
};

export type FormatoExportacion = "json" | "sql";

export type OpcionesExportacion = {
  conexionId: string;
  esquema: string;
  formato: FormatoExportacion;
  estructura: boolean;
  datos: boolean;
  nombreArchivo: string;
};

export type ArchivoExportado = {
  nombreArchivo: string;
  contenido: string;
};

export type Relacion = {
  origen: string;
  columna: string;
  destino: string;
  columnaDestino: string;
};

export type Celda = string | number | boolean | null;

export type ResultadoConsulta = {
  columnas: string[];
  filas: Celda[][];
};

export type EntradaSalida = {
  numero: number;
  hora: string;
  accion: string;
  mensaje: string;
  duracion: string;
  correcto: boolean;
};

export type EstadoEditor = {
  sql: string;
  resultado: ResultadoConsulta | null;
  salida: EntradaSalida[];
};

export const OPERADORES = ["=", "!=", ">", ">=", "<", "<=", "LIKE", "IS NULL", "IS NOT NULL"] as const;

export type Operador = (typeof OPERADORES)[number];

export type Filtro = {
  columna: string;
  operador: Operador;
  valor: string;
};

export type Union = {
  relacion: Relacion;
  tipo: "INNER" | "LEFT";
};

export type Asignacion = {
  columna: string;
  valor: string;
};

export type Orden = {
  columna: string;
  direccion: "ASC" | "DESC";
};

export type TipoConsulta = "SELECT" | "INSERT" | "UPDATE" | "DELETE";

export type PeticionConsulta =
  | {
      tipo: "SELECT";
      esquema: string;
      tabla: string;
      columnas: string[];
      uniones: Union[];
      filtros: Filtro[];
      orden: Orden | null;
      limite: number;
    }
  | { tipo: "INSERT"; esquema: string; tabla: string; valores: Asignacion[] }
  | { tipo: "UPDATE"; esquema: string; tabla: string; valores: Asignacion[]; filtros: Filtro[] }
  | { tipo: "DELETE"; esquema: string; tabla: string; filtros: Filtro[] };

export type RespuestaConsulta = {
  sql: string;
  resultado: ResultadoConsulta | null;
  salida: EntradaSalida | null;
};
