import Link from "next/link";
import { BotonConfiguracion } from "./BotonConfiguracion";
import { BloqueDimension, IconoCasa } from "./IconosPixel";

export type PestanaActiva = "inicio" | "sql" | "diagrama";

type Props = {
  conexion?: { id: string; nombre: string | null };
  activa: PestanaActiva;
};

const VISTAS: { id: PestanaActiva; etiqueta: string; ruta: string }[] = [
  { id: "sql", etiqueta: "SQL Editor", ruta: "editor" },
  { id: "diagrama", etiqueta: "EER Diagram", ruta: "diagrama" },
];

function clasePestana(activa: boolean) {
  return `presionable flex h-10 items-center gap-2 border-[3px] border-b-0 border-black px-3 text-xl ${
    activa ? "bg-mc-panel text-mc-tinta" : "bg-mc-boton text-white sombra-texto hover:bg-mc-hover"
  }`;
}

export function BarraPestanas({ conexion, activa }: Props) {
  return (
    <div className="textura-pizarra flex items-end gap-1.5 border-b-4 border-black px-3 pt-2">
      <Link
        href="/"
        aria-label="Inicio"
        aria-current={activa === "inicio" ? "page" : undefined}
        className={`${clasePestana(activa === "inicio")} w-11 justify-center px-0`}
      >
        <IconoCasa tamano={22} />
      </Link>

      {conexion && (
        <>
          <span className="flex h-10 items-center gap-2 border-[3px] border-b-0 border-black bg-mc-pizarra px-3 text-xl text-white">
            <BloqueDimension tamano={18} />
            {conexion.nombre ?? "Sin conexión"}
          </span>
          {VISTAS.map((v) => (
            <Link
              key={v.id}
              href={`/conexion/${conexion.id}/${v.ruta}`}
              aria-current={activa === v.id ? "page" : undefined}
              className={clasePestana(activa === v.id)}
            >
              {v.etiqueta}
            </Link>
          ))}
        </>
      )}

      <BotonConfiguracion />
    </div>
  );
}
