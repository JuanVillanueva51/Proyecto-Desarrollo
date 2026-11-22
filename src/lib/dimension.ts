export const DIMENSIONES = ["overworld", "nether", "end"] as const;

export type Dimension = (typeof DIMENSIONES)[number];

export const COOKIE_DIMENSION = "dimension";

export const NOMBRE_DIMENSION: Record<Dimension, string> = {
  overworld: "Overworld",
  nether: "Nether",
  end: "The End",
};

export function esDimension(valor: unknown): valor is Dimension {
  return typeof valor === "string" && (DIMENSIONES as readonly string[]).includes(valor);
}
