import { obtenerConexiones } from "@/lib/datos/fuente";
import type { ConjuntoMenus } from "@/lib/menus";
import { Avisos } from "./Avisos";
import { BarraMenus } from "./BarraMenus";
import { BarraPestanas, type PestanaActiva } from "./BarraPestanas";
import { VentanaConfiguracion } from "./VentanaConfiguracion";
import { VentanaConfirmacion } from "./VentanaConfirmacion";
import { VentanaConexion } from "./ventanas/VentanaConexion";
import { VentanaConexiones } from "./ventanas/VentanaConexiones";
import { VentanaEditorTabla } from "./ventanas/VentanaEditorTabla";
import { VentanaExportar } from "./ventanas/VentanaExportar";
import { VentanaImportar } from "./ventanas/VentanaImportar";

type Props = {
  conjunto: ConjuntoMenus;
  activa: PestanaActiva;
  conexion?: { id: string; nombre: string | null };
  children: React.ReactNode;
};

export async function MarcoPantalla({ conjunto, activa, conexion, children }: Props) {
  const conexiones = await obtenerConexiones();

  return (
    <div className="flex min-h-screen flex-col bg-mc-fondo font-term text-white">
      <BarraMenus conjunto={conjunto} />
      <BarraPestanas conexion={conexion} activa={activa} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <VentanaConfiguracion />
      <VentanaConexion />
      <VentanaConexiones conexiones={conexiones} />
      <VentanaImportar conexiones={conexiones} />
      <VentanaExportar conexiones={conexiones} />
      <VentanaEditorTabla />
      <VentanaConfirmacion />
      <Avisos />
    </div>
  );
}
