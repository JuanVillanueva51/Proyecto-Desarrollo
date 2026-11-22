import { IconoBaseDatos, IconoMigracion, IconoModelo } from "./IconosPixel";

const SECCIONES: { id: string; etiqueta: string; Icono: typeof IconoModelo }[] = [
  { id: "conexiones", etiqueta: "Conexiones", Icono: IconoBaseDatos },
  { id: "modelos", etiqueta: "Modelos", Icono: IconoModelo },
  { id: "migracion", etiqueta: "Migración", Icono: IconoMigracion },
];

export function BarraLateral() {
  return (
    <aside
      aria-label="Secciones"
      className="textura-pizarra flex w-[72px] shrink-0 flex-col items-center gap-3 border-r-4 border-black py-4"
    >
      {SECCIONES.map(({ id, etiqueta, Icono }) => (
        <button
          key={id}
          type="button"
          aria-label={etiqueta}
          title={etiqueta}
          className="bisel-casilla flex h-12 w-12 items-center justify-center bg-mc-casilla hover:brightness-110"
        >
          <Icono tamano={30} />
        </button>
      ))}
    </aside>
  );
}
