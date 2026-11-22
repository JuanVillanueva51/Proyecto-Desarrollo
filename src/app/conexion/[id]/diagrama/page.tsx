import { DiagramaEER } from "@/components/eer/DiagramaEER";
import { MarcoPantalla } from "@/components/MarcoPantalla";
import { obtenerConexion, obtenerEsquemas } from "@/lib/datos/fuente";

export const metadata = { title: "EER Diagram · MCQL Workbench" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vista?: string }>;
};

export default async function Diagrama({ params, searchParams }: Props) {
  const { id } = await params;
  const { vista } = await searchParams;
  const [conexion, esquemas] = await Promise.all([obtenerConexion(id), obtenerEsquemas(id)]);

  return (
    <MarcoPantalla conjunto="diagrama" activa="diagrama" conexion={{ id, nombre: conexion?.nombre ?? null }}>
      <DiagramaEER conexionId={id} esquemas={esquemas} vistaInicial={vista === "clasica" ? "clasica" : "misiones"} />
    </MarcoPantalla>
  );
}
