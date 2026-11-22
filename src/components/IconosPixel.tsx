type Props = { tamano?: number; className?: string };

type Pixel = [number, number, number, number, string];

function Sprite({ tamano, className, lado, pixeles }: Props & { lado: number; pixeles: Pixel[] }) {
  return (
    <svg width={tamano} height={tamano} viewBox={`0 0 ${lado} ${lado}`} aria-hidden="true" className={className}>
      {pixeles.map(([x, y, w, h, color], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} style={{ fill: color }} />
      ))}
    </svg>
  );
}

export function BloqueDimension({ tamano = 32, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={8}
      pixeles={[
        [0, 0, 8, 8, "var(--d-bloque-b)"],
        [0, 0, 8, 2, "var(--d-bloque-a)"],
        [0, 2, 1, 1, "var(--d-bloque-a)"],
        [3, 2, 1, 1, "var(--d-bloque-a)"],
        [6, 2, 1, 2, "var(--d-bloque-a)"],
        [2, 4, 1, 1, "var(--d-bloque-c)"],
        [5, 5, 1, 1, "var(--d-bloque-d)"],
        [1, 6, 1, 1, "var(--d-bloque-d)"],
        [4, 7, 1, 1, "var(--d-bloque-c)"],
      ]}
    />
  );
}

export function Cofre({ tamano = 32, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [0, 2, 11, 8, "var(--d-cofre-c)"],
        [1, 3, 9, 6, "var(--d-cofre-b)"],
        [1, 3, 9, 2, "var(--d-cofre-a)"],
        [1, 5, 9, 1, "var(--d-cofre-c)"],
        [5, 4, 1, 3, "var(--d-cofre-d)"],
      ]}
    />
  );
}

export function IconoTabla({ tamano = 16, className, color }: Props & { color: string }) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={8}
      pixeles={[
        [0, 0, 8, 7, "#ebebeb"],
        [0, 0, 8, 2, color],
        [0, 4, 8, 1, "#969696"],
        [3, 2, 1, 5, "#969696"],
      ]}
    />
  );
}

export function IconoBaseDatos({ tamano = 18, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [2, 1, 7, 2, "#5bc8e6"],
        [1, 2, 1, 7, "#2e7f9c"],
        [9, 2, 1, 7, "#2e7f9c"],
        [2, 3, 7, 2, "#3aa3c7"],
        [2, 5, 7, 1, "#1d5f78"],
        [2, 6, 7, 2, "#3aa3c7"],
        [2, 8, 7, 1, "#1d5f78"],
        [2, 9, 7, 1, "#2e7f9c"],
        [3, 3, 1, 1, "#bff0ff"],
        [3, 6, 1, 1, "#bff0ff"],
      ]}
    />
  );
}

export function IconoModelo({ tamano = 30, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [1, 1, 3, 3, "#e0e0e0"],
        [7, 4, 3, 3, "#e0e0e0"],
        [2, 7, 3, 3, "#e0e0e0"],
        [4, 2, 4, 1, "#e0e0e0"],
        [8, 2, 1, 2, "#e0e0e0"],
        [2, 4, 1, 3, "#e0e0e0"],
      ]}
    />
  );
}

export function IconoMigracion({ tamano = 30, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [1, 4, 6, 3, "#e0e0e0"],
        [6, 2, 1, 7, "#e0e0e0"],
        [7, 3, 1, 5, "#e0e0e0"],
        [8, 4, 1, 3, "#e0e0e0"],
        [9, 5, 1, 1, "#e0e0e0"],
      ]}
    />
  );
}

export function IconoUsuario({ tamano = 16, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={6}
      pixeles={[
        [2, 0, 2, 2, "currentColor"],
        [1, 3, 4, 3, "currentColor"],
      ]}
    />
  );
}

export function IconoEnchufe({ tamano = 16, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={6}
      pixeles={[
        [1, 0, 1, 2, "currentColor"],
        [4, 0, 1, 2, "currentColor"],
        [0, 2, 6, 2, "currentColor"],
        [2, 4, 2, 2, "currentColor"],
      ]}
    />
  );
}

export function IconoCasa({ tamano = 20, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [8, 1, 1, 3, "#5a5a5a"],
        [5, 0, 1, 1, "#7a2a1c"],
        [4, 1, 3, 1, "#7a2a1c"],
        [3, 2, 5, 1, "#b5452e"],
        [2, 3, 7, 1, "#b5452e"],
        [1, 4, 9, 1, "#7a2a1c"],
        [5, 1, 1, 1, "#d8664a"],
        [4, 2, 2, 1, "#d8664a"],
        [2, 5, 7, 6, "#3a2a1a"],
        [3, 5, 5, 5, "#efe3c6"],
        [4, 7, 2, 4, "#7a5233"],
        [6, 6, 1, 1, "#5bc8e6"],
      ]}
    />
  );
}

export function IconoEngrane({ tamano = 20, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [4, 0, 3, 2, "#ffffff"],
        [4, 9, 3, 2, "#ffffff"],
        [0, 4, 2, 3, "#ffffff"],
        [9, 4, 2, 3, "#ffffff"],
        [1, 1, 2, 2, "#ffffff"],
        [8, 1, 2, 2, "#ffffff"],
        [1, 8, 2, 2, "#ffffff"],
        [8, 8, 2, 2, "#ffffff"],
        [2, 2, 7, 7, "#ffffff"],
        [4, 4, 3, 3, "var(--d-boton-bajo)"],
      ]}
    />
  );
}

export function IconoNuevo({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [2, 1, 6, 9, "#ffffff"],
        [3, 3, 4, 1, "var(--d-boton)"],
        [3, 5, 4, 1, "var(--d-boton)"],
        [7, 7, 3, 1, "#55ff55"],
        [8, 6, 1, 3, "#55ff55"],
      ]}
    />
  );
}

export function IconoAbrir({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [1, 3, 9, 6, "var(--d-cofre-a)"],
        [1, 2, 4, 1, "var(--d-cofre-a)"],
        [1, 5, 9, 1, "var(--d-cofre-c)"],
      ]}
    />
  );
}

export function IconoGuardar({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [1, 1, 9, 9, "#5bc8e6"],
        [3, 1, 5, 3, "#ffffff"],
        [3, 6, 5, 4, "#1d5f78"],
      ]}
    />
  );
}

export function IconoRayo({ tamano = 22, className, actual = false }: Props & { actual?: boolean }) {
  const pixeles: Pixel[] = [
    [5, 0, 3, 1, "var(--d-oro)"],
    [4, 1, 3, 2, "var(--d-oro)"],
    [3, 3, 3, 2, "var(--d-oro)"],
    [2, 5, 7, 1, "var(--d-oro)"],
    [5, 6, 3, 2, "var(--d-oro)"],
    [4, 8, 2, 2, "var(--d-oro)"],
  ];
  if (actual) pixeles.push([0, 9, 2, 2, "#ffffff"]);
  else pixeles.push([3, 10, 1, 1, "var(--d-oro)"]);
  return <Sprite tamano={tamano} className={className} lado={11} pixeles={pixeles} />;
}

export function IconoLupa({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [1, 1, 6, 1, "#ffffff"],
        [1, 6, 6, 1, "#ffffff"],
        [1, 1, 1, 6, "#ffffff"],
        [6, 1, 1, 6, "#ffffff"],
        [7, 7, 1, 1, "#ffffff"],
        [8, 8, 2, 2, "#ffffff"],
      ]}
    />
  );
}

export function IconoDetener({ tamano = 22, className }: Props) {
  return <Sprite tamano={tamano} className={className} lado={11} pixeles={[[2, 2, 7, 7, "#ff5555"]]} />;
}

export function IconoCorrecto({ tamano = 16, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={6}
      pixeles={[
        [1, 0, 4, 6, "#17dd62"],
        [0, 1, 6, 4, "#17dd62"],
        [2, 1, 1, 2, "#b8ffd0"],
      ]}
    />
  );
}

export function IconoError({ tamano = 16, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={6}
      pixeles={[
        [1, 0, 4, 6, "#ff5555"],
        [0, 1, 6, 4, "#ff5555"],
        [2, 1, 1, 2, "#ffc2c2"],
      ]}
    />
  );
}

export function IconoVista({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [1, 3, 9, 5, "#d0d0d0"],
        [4, 4, 3, 3, "#2e7f9c"],
        [5, 5, 1, 1, "#000000"],
      ]}
    />
  );
}

export function IconoRutina({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [2, 1, 7, 9, "#e8dcc0"],
        [3, 3, 5, 1, "#7a5233"],
        [3, 5, 5, 1, "#7a5233"],
        [3, 7, 3, 1, "#7a5233"],
      ]}
    />
  );
}

export function IconoArbol({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [4, 0, 3, 3, "#ffffff"],
        [5, 3, 1, 2, "#ffffff"],
        [1, 5, 9, 1, "#ffffff"],
        [1, 6, 1, 2, "#ffffff"],
        [9, 6, 1, 2, "#ffffff"],
        [0, 8, 3, 3, "#ffffff"],
        [8, 8, 3, 3, "#ffffff"],
      ]}
    />
  );
}

export function IconoTablas({ tamano = 22, className }: Props) {
  return (
    <Sprite
      tamano={tamano}
      className={className}
      lado={11}
      pixeles={[
        [0, 1, 5, 4, "#ffffff"],
        [6, 1, 5, 4, "#ffffff"],
        [3, 7, 5, 4, "#ffffff"],
        [0, 1, 5, 1, "var(--d-oro)"],
        [6, 1, 5, 1, "var(--d-oro)"],
        [3, 7, 5, 1, "var(--d-oro)"],
      ]}
    />
  );
}
