"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useRef, useState, useTransition } from "react";
import { guardarConexion, probarConexion } from "@/lib/datos/acciones";
import type { Conexion } from "@/lib/datos/tipos";
import { avisar } from "@/lib/eventos";
import { BotonMc } from "../BotonMc";
import { CAMPO, FilaCampo } from "../FilaCampo";
import { Ventana } from "../Ventana";

type Pestana = "parametros" | "ssl" | "avanzado";

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "parametros", etiqueta: "Parameters" },
  { id: "ssl", etiqueta: "SSL" },
  { id: "avanzado", etiqueta: "Advanced" },
];

const GRID = "grid grid-cols-1 items-center gap-x-3 gap-y-3 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,240px)]";

const Inicial = createContext<Conexion | null>(null);

function Formulario({ inicial, cerrar }: { inicial: Conexion | null; cerrar: () => void }) {
  const router = useRouter();
  const [pestana, setPestana] = useState<Pestana>("parametros");
  const formulario = useRef<HTMLFormElement>(null);
  const [pendiente, iniciar] = useTransition();

  const probar = () => {
    if (!formulario.current) return;
    const datos = new FormData(formulario.current);
    iniciar(async () => {
      const correcto = await probarConexion(datos);
      avisar(correcto ? { tipo: "exito", texto: "Conexión correcta" } : { tipo: "error", texto: "No se pudo conectar" });
    });
  };

  const guardar = (datos: FormData) =>
    iniciar(async () => {
      await guardarConexion(datos);
      cerrar();
      router.refresh();
    });

  return (
    <Inicial.Provider value={inicial}>
      <form ref={formulario} action={guardar} className="flex flex-col gap-4 p-5">
        {inicial && <input type="hidden" name="id" value={inicial.id} />}

        <div className={GRID}>
          <FilaCampo etiqueta="Connection Name" htmlFor="nombre" ayuda="Type a name for the connection">
            <input id="nombre" name="nombre" required defaultValue={inicial?.nombre} className={CAMPO} />
          </FilaCampo>
          <FilaCampo etiqueta="Connection Method" htmlFor="metodo" ayuda="Method to use to connect to the RDBMS">
            <select id="metodo" name="metodo" className={CAMPO}>
              <option>Standard (TCP/IP)</option>
              <option>Local Socket/Pipe</option>
              <option>Standard TCP/IP over SSH</option>
            </select>
          </FilaCampo>
        </div>

        <div>
          <div role="tablist" aria-label="Opciones de conexión" className="flex gap-1">
            {PESTANAS.map((p) => {
              const activa = p.id === pestana;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  id={`tab-${p.id}`}
                  aria-selected={activa}
                  aria-controls={`panel-${p.id}`}
                  onClick={() => setPestana(p.id)}
                  className={`relative border-2 border-b-0 border-black px-4 py-0.5 text-lg ${
                    activa ? "top-0.5 bg-mc-panel" : "bg-mc-casilla hover:brightness-110"
                  }`}
                >
                  {p.etiqueta}
                </button>
              );
            })}
          </div>

          <div className="min-h-[300px] border-2 border-black bg-mc-panel p-5">
            <div role="tabpanel" id="panel-parametros" aria-labelledby="tab-parametros" hidden={pestana !== "parametros"}>
              <PanelParametros />
            </div>
            <div role="tabpanel" id="panel-ssl" aria-labelledby="tab-ssl" hidden={pestana !== "ssl"}>
              <PanelSsl />
            </div>
            <div role="tabpanel" id="panel-avanzado" aria-labelledby="tab-avanzado" hidden={pestana !== "avanzado"}>
              <PanelAvanzado />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BotonMc variante="claro">Configure server management</BotonMc>
          <span className="flex-1" />
          <BotonMc variante="claro" onClick={probar} disabled={pendiente}>
            Test Connection
          </BotonMc>
          <BotonMc variante="claro" onClick={cerrar}>
            Cancel
          </BotonMc>
          <BotonMc variante="claro" tipo="submit" className="min-w-16" disabled={pendiente}>
            OK
          </BotonMc>
        </div>
      </form>
    </Inicial.Provider>
  );
}

export function VentanaConexion() {
  return (
    <Ventana
      nombre="conexion"
      titulo={(datos) => (datos?.conexion ? "Edit Connection" : "Setup New Connection")}
      ancho="w-[min(920px,94vw)]"
    >
      {(datos, cerrar) => <Formulario inicial={datos?.conexion ?? null} cerrar={cerrar} />}
    </Ventana>
  );
}


function PanelParametros() {
  const inicial = useContext(Inicial);
  return (
    <div className={GRID}>
      <FilaCampo etiqueta="Hostname" htmlFor="host" ayuda="Name or IP address of the server host - and TCP/IP port.">
        <input id="host" name="host" defaultValue={inicial?.host} className={CAMPO} />
        <label htmlFor="puerto" className="text-xl">
          Port:
        </label>
        <input id="puerto" name="puerto" defaultValue={inicial?.puerto ?? 3306} inputMode="numeric" className={`${CAMPO} max-w-24`} />
      </FilaCampo>
      <FilaCampo etiqueta="Username" htmlFor="usuario" ayuda="Name of the user to connect with.">
        <input id="usuario" name="usuario" defaultValue={inicial?.usuario} className={CAMPO} />
      </FilaCampo>
      <FilaCampo etiqueta="Password" ayuda="">
        <BotonMc variante="claro">Store in Vault...</BotonMc>
        <BotonMc variante="claro">Clear</BotonMc>
      </FilaCampo>
      <FilaCampo
        etiqueta="Default Schema"
        htmlFor="esquema"
        ayuda="The schema to use as default schema. Leave blank to select it later."
      >
        <input id="esquema" name="esquema" defaultValue={inicial?.esquemaPorDefecto ?? undefined} className={CAMPO} />
      </FilaCampo>
    </div>
  );
}

function CampoArchivo({ id, etiqueta, ayuda }: { id: string; etiqueta: string; ayuda: string }) {
  return (
    <FilaCampo etiqueta={etiqueta} htmlFor={id} ayuda={ayuda}>
      <input id={id} name={id} className={CAMPO} />
      <BotonMc variante="claro" aria-label={`Buscar archivo para ${etiqueta}`} className="h-9 px-3">
        ...
      </BotonMc>
    </FilaCampo>
  );
}

function PanelSsl() {
  return (
    <div className={GRID}>
      <FilaCampo etiqueta="Use SSL" htmlFor="usarSsl" ayuda="Turns on SSL encryption. Connection will fail if SSL is not available.">
        <select id="usarSsl" name="usarSsl" className={CAMPO}>
          <option>No</option>
          <option>If available</option>
          <option>Require</option>
          <option>Require and Verify CA</option>
          <option>Require and Verify Identity</option>
        </select>
      </FilaCampo>
      <CampoArchivo id="sslKey" etiqueta="SSL Key File" ayuda="Path to Client Key file for SSL." />
      <CampoArchivo id="sslCert" etiqueta="SSL CERT File" ayuda="Path to Client Certificate file for SSL." />
      <CampoArchivo id="sslCa" etiqueta="SSL CA File" ayuda="Path to Certificate Authority file for SSL." />
      <FilaCampo etiqueta="SSL Cipher" htmlFor="sslCipher" ayuda="Optional: separated list of permissible ciphers to use for SSL encryption.">
        <input id="sslCipher" name="sslCipher" className={CAMPO} />
      </FilaCampo>
      <FilaCampo>
        <BotonMc variante="claro">SSL Wizard ...</BotonMc>
      </FilaCampo>
      <FilaCampo>
        <BotonMc variante="claro">Files ...</BotonMc>
      </FilaCampo>
    </div>
  );
}

function Casilla({ id, texto, ayuda, sangria = false }: { id: string; texto: string; ayuda: string; sangria?: boolean }) {
  return (
    <FilaCampo ayuda={ayuda}>
      <label htmlFor={id} className={`flex items-center gap-2 text-xl ${sangria ? "pl-6" : ""}`}>
        <input id={id} name={id} type="checkbox" className="h-5 w-5 accent-mc-seleccion" />
        {texto}
      </label>
    </FilaCampo>
  );
}

function PanelAvanzado() {
  return (
    <div className={GRID}>
      <Casilla id="compresion" texto="Use compression protocol" ayuda="Select this option for WAN connections" />
      <Casilla
        id="ansi"
        sangria
        texto="Use ANSI quotes to quote identifiers"
        ayuda="If enabled this option overwrites the serverside settings"
      />
      <Casilla
        id="cleartext"
        sangria
        texto="Enable Cleartext Authentication Plugin"
        ayuda="Send user password in cleartext. Required for some authentication methods."
      />
      <FilaCampo etiqueta="Timeout" htmlFor="timeout" ayuda="Maximum time to wait before a connection is aborted.">
        <input id="timeout" name="timeout" defaultValue="60" inputMode="numeric" className={CAMPO} />
      </FilaCampo>
      <FilaCampo etiqueta="MCQL_MODE" htmlFor="modo" ayuda="Override the default MCQL_MODE used by the server.">
        <input id="modo" name="modo" className={CAMPO} />
      </FilaCampo>
      <FilaCampo etiqueta="Others" htmlFor="otros" ayuda="Other options for Connector/C++ as option=value pairs, one per line.">
        <textarea id="otros" name="otros" rows={5} className={`${CAMPO} h-auto py-1`} />
      </FilaCampo>
    </div>
  );
}
