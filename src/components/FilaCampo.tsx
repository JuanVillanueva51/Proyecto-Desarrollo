type Props = {
  etiqueta?: string;
  htmlFor?: string;
  ayuda?: string;
  children: React.ReactNode;
};

export function FilaCampo({ etiqueta, htmlFor, ayuda, children }: Props) {
  return (
    <>
      {etiqueta ? (
        htmlFor ? (
          <label htmlFor={htmlFor} className="text-xl md:text-right">
            {etiqueta}:
          </label>
        ) : (
          <span className="text-xl md:text-right">{etiqueta}:</span>
        )
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="flex min-w-0 items-center gap-2">{children}</div>
      <p className="text-lg leading-tight text-mc-ayuda">{ayuda}</p>
    </>
  );
}

export const CAMPO =
  "h-9 min-w-0 flex-1 border-2 border-[#a0a0a0] bg-black px-2 text-xl text-white outline-none focus:border-white";
