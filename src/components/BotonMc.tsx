import Link from "next/link";

type Variante = "oscuro" | "claro" | "confirmar" | "seleccionado" | "peligro";

const ESTILOS: Record<Variante, string> = {
  oscuro: "bg-mc-boton text-white bisel-boton sombra-texto",
  claro: "bg-[color-mix(in_srgb,var(--d-panel)_70%,white)] text-mc-tinta bisel-boton-claro",
  confirmar: "bg-mc-confirmar text-white bisel-boton sombra-texto",
  seleccionado: "bg-mc-seleccion text-white bisel-boton sombra-texto",
  peligro: "bg-[#a32424] text-white bisel-boton sombra-texto",
};

type Props = {
  children: React.ReactNode;
  variante?: Variante;
  href?: string;
  tipo?: "button" | "submit";
  formAction?: (formulario: FormData) => void | Promise<void>;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
};

export function BotonMc({
  children,
  variante = "oscuro",
  href,
  tipo = "button",
  formAction,
  onClick,
  className = "",
  disabled,
  ...aria
}: Props) {
  const clases = `presionable inline-flex h-10 items-center justify-center gap-2 border-2 border-black px-4 text-xl leading-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${ESTILOS[variante]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={clases} aria-label={aria["aria-label"]}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={tipo}
      formAction={formAction}
      onClick={onClick}
      className={clases}
      disabled={disabled}
      aria-label={aria["aria-label"]}
      aria-pressed={aria["aria-pressed"]}
    >
      {children}
    </button>
  );
}
