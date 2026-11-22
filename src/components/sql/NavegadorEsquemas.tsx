import Link from "next/link";
import { colorTabla } from "@/lib/datos/esquema";
import type { Esquema } from "@/lib/datos/tipos";
import { EstadoVacio } from "../EstadoVacio";
import { Cofre, IconoBaseDatos, IconoTabla } from "../IconosPixel";

type Props = {
  esquemas: Esquema[];
  esquemaActivo: string | null;
  tablaActiva: string | null;
  enlace?: (esquema: string, tabla: string) => string;
  alElegir?: (esquema: string, tabla: string) => void;
  children?: React.ReactNode;
};

const FILA = "flex w-full items-center gap-2 px-1 text-left";

export function NavegadorEsquemas({ esquemas, esquemaActivo, tablaActiva, enlace, alElegir, children }: Props) {
  return (
    <aside
      aria-label="Navegador"
      className="textura-pizarra flex w-full flex-col border-black md:w-[280px] md:shrink-0 md:border-r-4"
    >
      <div className="flex gap-1 px-2.5 pt-2.5">
        <button
          type="button"
          className="h-9 flex-1 border-[3px] border-b-0 border-black bg-mc-boton text-lg text-white"
        >
          Administration
        </button>
        <button type="button" className="h-9 flex-1 border-[3px] border-b-0 border-black bg-mc-panel text-lg text-mc-tinta">
          Schemas
        </button>
      </div>
      <div className="border-t-[3px] border-black p-2.5">
        <label className="block">
          <span className="sr-only">Filtrar objetos</span>
          <input
            type="search"
            placeholder="Filter objects"
            className="bisel-casilla h-9 w-full bg-mc-casilla px-2 text-lg text-mc-tinta outline-none placeholder:text-mc-ayuda"
          />
        </label>
      </div>

      {esquemas.length === 0 ? (
        <EstadoVacio texto="Sin esquemas" />
      ) : (
        <ul className="flex flex-col px-2.5 pb-3 text-xl leading-relaxed text-white">
          {esquemas.map((esquema) => {
            const abierto = esquema.nombre === esquemaActivo;
            return (
              <li key={esquema.nombre}>
                <span className={FILA}>
                  <span className="text-mc-suave">{abierto ? "▾" : "▸"}</span>
                  <IconoBaseDatos />
                  <span className={abierto ? "text-mc-oro" : ""}>{esquema.nombre}</span>
                </span>
                {abierto && (
                  <ul>
                    <li>
                      <span className={`${FILA} pl-6`}>
                        <span className="text-mc-suave">▾</span>
                        <Cofre tamano={18} />
                        Tables
                      </span>
                      <ul>
                        {esquema.tablas.length === 0 && (
                          <li className="pl-12 text-lg text-mc-suave">Sin tablas</li>
                        )}
                        {esquema.tablas.map((tabla, i) => {
                          const activa = tabla.nombre === tablaActiva;
                          const clase = `${FILA} pl-12 ${activa ? "bg-mc-seleccion" : "hover:bg-white/10"}`;
                          const contenido = (
                            <>
                              <IconoTabla color={colorTabla(i)} />
                              {tabla.nombre}
                            </>
                          );
                          return (
                            <li key={tabla.nombre}>
                              {enlace ? (
                                <Link href={enlace(esquema.nombre, tabla.nombre)} className={clase} aria-current={activa ? "true" : undefined}>
                                  {contenido}
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  className={clase}
                                  aria-pressed={activa}
                                  onClick={() => alElegir?.(esquema.nombre, tabla.nombre)}
                                >
                                  {contenido}
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                    {["Views", "Stored Procedures", "Functions"].map((grupo) => (
                      <li key={grupo} className={`${FILA} pl-6`}>
                        <span className="text-mc-suave">▸</span>
                        {grupo}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {children}
    </aside>
  );
}
