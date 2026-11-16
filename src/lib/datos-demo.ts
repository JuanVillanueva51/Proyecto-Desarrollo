// Datos de ejemplo para ver las pantallas sin base de datos.
// Siguiente paso: reemplazar por prisma.conexion.findMany().

export type ConexionDemo = {
  id: number;
  nombre: string;
  usuario: string;
  host: string;
  puerto: number;
};

export const CONEXIONES_DEMO: ConexionDemo[] = [
  { id: 1, nombre: "Conexión 1", usuario: "root", host: "db-minecra.ct2wm86cgbxl.us-east-2.rds.amazonaws.com", puerto: 3306 },
  { id: 2, nombre: "Conexión 2", usuario: "root", host: "db-minecra.ct2wm86cgbxl.us-east-2.rds.amazonaws.com", puerto: 3306 },
  { id: 3, nombre: "Conexión 3", usuario: "root", host: "db-minecra.ct2wm86cgbxl.us-east-2.rds.amazonaws.com", puerto: 3306 },
  { id: 4, nombre: "Conexión 4", usuario: "root", host: "db-minecra.ct2wm86cgbxl.us-east-2.rds.amazonaws.com", puerto: 3306 },
];
