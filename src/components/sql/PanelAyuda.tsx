import { EstadoVacio } from "../EstadoVacio";

export function PanelAyuda() {
  return (
    <aside
      aria-label="SQL Additions"
      className="textura-pizarra flex w-full flex-col gap-2.5 border-black p-3 lg:w-[270px] lg:shrink-0 lg:border-l-4"
    >
      <h2 className="font-pixel text-lg text-white">SQL Additions</h2>
      <div className="flex gap-1">
        <button type="button" className="h-9 flex-1 border-[3px] border-black bg-mc-panel text-lg text-mc-tinta">
          Context Help
        </button>
        <button type="button" className="h-9 flex-1 border-[3px] border-black bg-mc-boton text-lg text-white">
          Snippets
        </button>
      </div>
      <div className="bisel-casilla bg-mc-consola p-3">
        <EstadoVacio texto="Sin ayuda" className="py-2" />
      </div>
    </aside>
  );
}
