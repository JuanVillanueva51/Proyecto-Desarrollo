type Props = {
  texto: string;
  tono?: "claro" | "oscuro";
  className?: string;
};

export function EstadoVacio({ texto, tono = "oscuro", className = "" }: Props) {
  return (
    <p
      className={`px-3 py-4 text-center text-xl ${tono === "oscuro" ? "text-mc-suave" : "text-mc-ayuda"} ${className}`}
    >
      {texto}
    </p>
  );
}
