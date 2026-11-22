import { MarcoPantalla } from "@/components/MarcoPantalla";
import { EspacioEditor } from "@/components/sql/EspacioEditor";
import { NavegadorEsquemas } from "@/components/sql/NavegadorEsquemas";
import { PanelAyuda } from "@/components/sql/PanelAyuda";
import { PanelInformacion } from "@/components/sql/PanelInformacion";
import { obtenerConexion, obtenerEsquemas, obtenerEstadoEditor } from "@/lib/datos/fuente";

export const metadata = { title: "SQL Editor · MCQL Workbench" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ esquema?: string; tabla?: string }>;
};

export default async function EditorSql({ params, searchParams }: Props) {
  const { id } = await params;
  const filtro = await searchParams;
  const [conexion, esquemas, estado] = await Promise.all([
    obtenerConexion(id),
    obtenerEsquemas(id),
    obtenerEstadoEditor(id),
  ]);

  const esquema = esquemas.find((e) => e.nombre === filtro.esquema) ?? esquemas[0] ?? null;
  const tabla = esquema?.tablas.find((t) => t.nombre === filtro.tabla) ?? null;

  return (
    <MarcoPantalla conjunto="sql" activa="sql" conexion={{ id, nombre: conexion?.nombre ?? null }}>
      <EspacioEditor
        conexionId={id}
        esquemas={esquemas}
        esquemaActivo={esquema?.nombre ?? null}
        tablaActiva={tabla?.nombre ?? null}
        estadoInicial={estado}
        navegador={
          <NavegadorEsquemas
            esquemas={esquemas}
            esquemaActivo={esquema?.nombre ?? null}
            tablaActiva={tabla?.nombre ?? null}
            enlace={(e, t) => `/conexion/${id}/editor?esquema=${encodeURIComponent(e)}&tabla=${encodeURIComponent(t)}`}
          >
            <PanelInformacion tabla={tabla} />
          </NavegadorEsquemas>
        }
        ayuda={<PanelAyuda />}
      />
    </MarcoPantalla>
  );
}
