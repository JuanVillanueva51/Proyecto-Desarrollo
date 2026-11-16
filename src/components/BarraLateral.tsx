import { IconoBaseDatos, IconoMigracion, IconoModelo } from "./IconosPixel";

type Seccion = "conexiones" | "modelos" | "migracion";

const SECCIONES: { id: Seccion; etiqueta: string; Icono: typeof IconoBaseDatos }[] = [
  { id: "conexiones", etiqueta: "Conexiones", Icono: IconoBaseDatos },
  { id: "modelos", etiqueta: "Modelos", Icono: IconoModelo },
  { id: "migracion", etiqueta: "Migración", Icono: IconoMigracion },
];

// Barra lateral de pizarra con las secciones como casillas de inventario.
export function BarraLateral({ activa }: { activa: Seccion }) {
  return (
    <aside
      aria-label="Secciones"
      className="textura-pizarra flex w-[72px] shrink-0 flex-col items-center gap-3 border-r-4 border-black py-4"
    >
      {SECCIONES.map(({ id, etiqueta, Icono }) => {
        const esActiva = id === activa;
        return (
          <button
            key={id}
            type="button"
            aria-label={etiqueta}
            aria-current={esActiva ? "page" : undefined}
            className={`flex h-12 w-12 items-center justify-center ${
              esActiva
                ? "border-[3px] border-white bg-mc-casilla shadow-[0_0_0_2px_#000]"
                : "bisel-casilla bg-mc-casilla hover:bg-[#9b9b9b]"
            }`}
          >
            <Icono tamano={30} />
          </button>
        );
      })}
    </aside>
  );
}
