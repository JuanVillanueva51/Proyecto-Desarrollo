type Props = {
  etiqueta: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function BotonIcono({ etiqueta, children, onClick, disabled, className = "" }: Props) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      title={etiqueta}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 w-11 items-center justify-center border-2 border-black bg-mc-boton bisel-boton cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
