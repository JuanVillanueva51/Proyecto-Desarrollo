import type { Columna } from "./datos/tipos";

export function marcaColumna(columna: Columna): { icono: string; color: string; colorClaro: string } {
  if (columna.llavePrimaria) return { icono: "◆", color: "#ffd23f", colorClaro: "#8a6100" };
  if (columna.referencia) return { icono: "◆", color: "#ff6b6b", colorClaro: "#b02020" };
  return { icono: "◇", color: "#9ad7ea", colorClaro: "#2e7f9c" };
}
