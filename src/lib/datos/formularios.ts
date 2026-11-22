import type { NuevaConexion } from "./tipos";

function texto(formulario: FormData, campo: string): string {
  const valor = formulario.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

function numero(formulario: FormData, campo: string, porDefecto: number): number {
  const valor = Number(texto(formulario, campo));
  return Number.isFinite(valor) && valor > 0 ? valor : porDefecto;
}

export function leerFormularioConexion(formulario: FormData): NuevaConexion {
  const esquema = texto(formulario, "esquema");
  return {
    nombre: texto(formulario, "nombre"),
    metodo: texto(formulario, "metodo"),
    host: texto(formulario, "host"),
    puerto: numero(formulario, "puerto", 3306),
    usuario: texto(formulario, "usuario"),
    esquemaPorDefecto: esquema || null,
    ssl: {
      modo: texto(formulario, "usarSsl"),
      llave: texto(formulario, "sslKey"),
      certificado: texto(formulario, "sslCert"),
      autoridad: texto(formulario, "sslCa"),
      cifrado: texto(formulario, "sslCipher"),
    },
    avanzado: {
      compresion: formulario.has("compresion"),
      comillasAnsi: formulario.has("ansi"),
      textoPlano: formulario.has("cleartext"),
      tiempoEspera: numero(formulario, "timeout", 60),
      modoSql: texto(formulario, "modo"),
      otros: texto(formulario, "otros"),
    },
  };
}
