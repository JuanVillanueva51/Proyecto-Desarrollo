import type { Columna, Tabla } from "@/lib/datos/tipos";
import { marcaColumna } from "@/lib/marcas";
import { EstadoVacio } from "../EstadoVacio";

function etiquetaTipo(columna: Columna): string {
  const partes = [columna.tipo];
  if (columna.autoIncremento) partes.push("AI");
  if (columna.llavePrimaria) partes.push("PK");
  if (columna.referencia) partes.push("FK");
  return partes.join(" ");
}

export function PanelInformacion({ tabla }: { tabla: Tabla | null }) {
  return (
    <section aria-labelledby="titulo-informacion" className="mt-auto border-t-4 border-black p-3">
      <h2 id="titulo-informacion" className="mb-2 font-pixel text-lg text-white">
        Information
      </h2>
      <div className="bisel-casilla bg-mc-consola px-3 py-2 text-lg leading-snug text-mc-suave">
        {tabla ? (
          <>
            <p>
              Table: <span className="text-mc-oro">{tabla.nombre}</span>
            </p>
            <p className="mt-1.5">Columns:</p>
            <ul>
              {tabla.columnas.map((c) => {
                const marca = marcaColumna(c);
                return (
                  <li key={c.nombre}>
                    <span style={{ color: marca.color }}>{marca.icono}</span> <span className="text-white">{c.nombre}</span>{" "}
                    {etiquetaTipo(c)}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <EstadoVacio texto="Sin selección" className="py-2" />
        )}
      </div>
    </section>
  );
}
