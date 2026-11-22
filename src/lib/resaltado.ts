export type Token = { texto: string; clase: "palabra" | "cadena" | "numero" | "comentario" | "normal" };

const PALABRAS = new Set(
  [
    "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "NULL", "IS", "IN", "LIKE", "AS", "ON", "JOIN", "INNER",
    "LEFT", "RIGHT", "OUTER", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "ASC", "DESC", "INSERT",
    "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DATABASE", "DROP", "ALTER", "USE",
    "DISTINCT", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "DEFAULT", "AUTO_INCREMENT",
  ]
);

const PATRON = /(--.*$)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]+\b)/g;

export function resaltarLinea(linea: string): Token[] {
  const tokens: Token[] = [];
  let ultimo = 0;
  for (const m of linea.matchAll(PATRON)) {
    const inicio = m.index ?? 0;
    if (inicio > ultimo) tokens.push({ texto: linea.slice(ultimo, inicio), clase: "normal" });
    const [texto, comentario, cadena, numero, palabra] = m;
    if (comentario) tokens.push({ texto, clase: "comentario" });
    else if (cadena) tokens.push({ texto, clase: "cadena" });
    else if (numero) tokens.push({ texto, clase: "numero" });
    else if (palabra && PALABRAS.has(palabra.toUpperCase())) tokens.push({ texto, clase: "palabra" });
    else tokens.push({ texto, clase: "normal" });
    ultimo = inicio + texto.length;
  }
  if (ultimo < linea.length) tokens.push({ texto: linea.slice(ultimo), clase: "normal" });
  return tokens;
}
