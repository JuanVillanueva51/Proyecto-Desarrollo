import { resaltarLinea, type Token } from "@/lib/resaltado";

const COLOR: Record<Token["clase"], string> = {
  palabra: "text-[#ffaa00]",
  cadena: "text-[#55ff55]",
  numero: "text-[#55ffff]",
  comentario: "text-[#8f8f8f]",
  normal: "text-white",
};

type Props = {
  sql: string;
  pestanas: string[];
  etiqueta?: string;
};

export function EditorSoloLectura({ sql, pestanas, etiqueta = "SQL" }: Props) {
  const lineas = sql ? sql.split("\n") : [""];

  return (
    <section aria-label={etiqueta} className="flex flex-col border-b-4 border-black">
      <div className="textura-piedra flex gap-1.5 border-b-[3px] border-black px-3 pt-2">
        {pestanas.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className={`border-[3px] border-b-0 border-black px-4 py-1 text-xl ${
              i === 0 ? "bg-mc-consola text-white" : "bg-mc-boton text-mc-suave"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
      <div
        role="textbox"
        aria-readonly="true"
        aria-multiline="true"
        aria-label={etiqueta}
        className="flex min-h-[230px] overflow-auto bg-mc-consola text-[22px] leading-[1.4]"
      >
        <ol aria-hidden="true" className="min-w-11 border-r-[3px] border-black bg-black/25 px-2.5 py-3 text-right text-[#8f8f8f]">
          {lineas.map((_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </ol>
        <pre className="flex-1 whitespace-pre-wrap px-4 py-3 font-term">
          {lineas.map((linea, i) => (
            <span key={i} className="block min-h-[1.4em]">
              {resaltarLinea(linea).map((t, j) => (
                <span key={j} className={COLOR[t.clase]}>
                  {t.texto}
                </span>
              ))}
            </span>
          ))}
        </pre>
      </div>
    </section>
  );
}
