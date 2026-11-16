import Link from "next/link";

type Variante = "oscuro" | "claro" | "verde";

const ESTILOS: Record<Variante, string> = {
  oscuro: "bg-mc-boton text-white bisel-boton [text-shadow:2px_2px_0_#3f3f3f]",
  claro: "bg-[#d6d6d6] text-mc-tinta bisel-boton-claro",
  verde: "bg-[#3f8a2c] text-white bisel-boton [text-shadow:2px_2px_0_#1e4a14]",
};

type Props = {
  children: React.ReactNode;
  variante?: Variante;
  href?: string;
  className?: string;
  "aria-label"?: string;
  disabled?: boolean;
};

// Botón con relieve estilo bloque. Con href se vuelve un enlace.
export function BotonMc({ children, variante = "oscuro", href, className = "", disabled, ...resto }: Props) {
  const clases = `inline-flex items-center justify-center border-2 border-black px-4 h-10 text-xl leading-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${ESTILOS[variante]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={clases} aria-label={resto["aria-label"]}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={clases} disabled={disabled} aria-label={resto["aria-label"]}>
      {children}
    </button>
  );
}
