import { BarraMenus } from "@/components/BarraMenus";
import { BarraPestanas } from "@/components/BarraPestanas";
import { DialogoConexion } from "@/components/DialogoConexion";

export const metadata = { title: "Setup New Connection · MCQL Workbench" };

export default function NuevaConexion() {
  return (
    <div className="flex min-h-screen flex-col">
      <BarraPestanas />
      <BarraMenus />
      <main className="textura-tierra flex flex-1 items-start justify-center p-6 md:items-center">
        <DialogoConexion />
      </main>
    </div>
  );
}
