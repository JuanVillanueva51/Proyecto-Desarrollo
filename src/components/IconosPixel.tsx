// Íconos en pixel art dibujados con <rect>. Todos son decorativos (aria-hidden).

type Props = { tamano?: number; className?: string };

export function BloquePasto({ tamano = 32, className }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 8 8" aria-hidden="true" className={className}>
      <rect width="8" height="8" fill="#7a5233" />
      <rect width="8" height="2" fill="#5d9b3a" />
      <rect x="0" y="2" width="1" height="1" fill="#5d9b3a" />
      <rect x="3" y="2" width="1" height="1" fill="#5d9b3a" />
      <rect x="6" y="2" width="1" height="2" fill="#5d9b3a" />
      <rect x="2" y="4" width="1" height="1" fill="#5b3c25" />
      <rect x="5" y="5" width="1" height="1" fill="#9a6c45" />
      <rect x="1" y="6" width="1" height="1" fill="#9a6c45" />
      <rect x="4" y="7" width="1" height="1" fill="#5b3c25" />
    </svg>
  );
}

export function IconoBaseDatos({ tamano = 40, className }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 11 11" aria-hidden="true" className={className}>
      <rect x="2" y="1" width="7" height="2" fill="#5bc8e6" />
      <rect x="1" y="2" width="1" height="7" fill="#2e7f9c" />
      <rect x="9" y="2" width="1" height="7" fill="#2e7f9c" />
      <rect x="2" y="3" width="7" height="2" fill="#3aa3c7" />
      <rect x="2" y="5" width="7" height="1" fill="#1d5f78" />
      <rect x="2" y="6" width="7" height="2" fill="#3aa3c7" />
      <rect x="2" y="8" width="7" height="1" fill="#1d5f78" />
      <rect x="2" y="9" width="7" height="1" fill="#2e7f9c" />
      <rect x="3" y="3" width="1" height="1" fill="#bff0ff" />
      <rect x="3" y="6" width="1" height="1" fill="#bff0ff" />
    </svg>
  );
}

export function IconoModelo({ tamano = 36, className }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 11 11" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="3" height="3" fill="#e0e0e0" />
      <rect x="7" y="4" width="3" height="3" fill="#e0e0e0" />
      <rect x="2" y="7" width="3" height="3" fill="#e0e0e0" />
      <rect x="4" y="2" width="4" height="1" fill="#e0e0e0" />
      <rect x="8" y="2" width="1" height="2" fill="#e0e0e0" />
      <rect x="2" y="4" width="1" height="3" fill="#e0e0e0" />
    </svg>
  );
}

export function IconoMigracion({ tamano = 36, className }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 11 11" aria-hidden="true" className={className}>
      <rect x="1" y="4" width="6" height="3" fill="#e0e0e0" />
      <rect x="6" y="2" width="1" height="7" fill="#e0e0e0" />
      <rect x="7" y="3" width="1" height="5" fill="#e0e0e0" />
      <rect x="8" y="4" width="1" height="3" fill="#e0e0e0" />
      <rect x="9" y="5" width="1" height="1" fill="#e0e0e0" />
    </svg>
  );
}

export function IconoUsuario({ tamano = 16, className }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 6 6" aria-hidden="true" className={className}>
      <rect x="2" y="0" width="2" height="2" fill="#3a3a3a" />
      <rect x="1" y="3" width="4" height="3" fill="#3a3a3a" />
    </svg>
  );
}

export function IconoEnchufe({ tamano = 16, className }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 6 6" aria-hidden="true" className={className}>
      <rect x="1" y="0" width="1" height="2" fill="#3a3a3a" />
      <rect x="4" y="0" width="1" height="2" fill="#3a3a3a" />
      <rect x="0" y="2" width="6" height="2" fill="#3a3a3a" />
      <rect x="2" y="4" width="2" height="2" fill="#3a3a3a" />
    </svg>
  );
}
