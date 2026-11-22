import type { Celda, ResultadoConsulta } from "@/lib/datos/tipos";
import { BotonMc } from "../BotonMc";
import { EstadoVacio } from "../EstadoVacio";

function mostrar(valor: Celda): string {
  if (valor === null) return "NULL";
  return String(valor);
}

export function TablaResultados({ resultado }: { resultado: ResultadoConsulta | null }) {
  return (
    <section aria-label="Result Grid" className="flex min-h-[220px] flex-1 flex-col">
      <div className="textura-piedra flex flex-wrap items-center gap-3 border-b-[3px] border-black px-3 py-2">
        <h2 className="sombra-texto font-pixel text-lg text-white">Result Grid</h2>
        <label htmlFor="filtrar-filas" className="sombra-texto text-xl text-white">
          Filter Rows:
        </label>
        <input
          id="filtrar-filas"
          type="search"
          className="bisel-casilla h-9 w-44 bg-mc-casilla px-2 text-lg text-mc-tinta outline-none"
        />
        <BotonMc className="h-9" disabled={!resultado}>
          Export
        </BotonMc>
        <BotonMc className="h-9">Wrap Cell Content</BotonMc>
      </div>
      <div className={`flex-1 overflow-auto ${resultado ? "bg-mc-panel" : "bg-mc-consola"}`}>
        {resultado && resultado.columnas.length > 0 ? (
          <table className="w-full min-w-[620px] border-collapse text-xl text-mc-tinta">
            <thead>
              <tr className="bg-mc-casilla text-left">
                {resultado.columnas.map((c) => (
                  <th key={c} scope="col" className="border-2 border-black/50 px-3 py-1">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultado.filas.map((fila, i) => (
                <tr key={i} className="odd:bg-white/25 hover:bg-mc-seleccion hover:text-white">
                  {fila.map((celda, j) => (
                    <td key={j} className="border-2 border-black/25 px-3 py-0.5">
                      {mostrar(celda)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EstadoVacio texto="Sin resultados" />
        )}
      </div>
    </section>
  );
}
