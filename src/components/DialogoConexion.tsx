"use client";

import { useState } from "react";
import { BotonMc } from "./BotonMc";
import { CAMPO, FilaCampo } from "./FilaCampo";

type Pestana = "parametros" | "ssl" | "avanzado";

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "parametros", etiqueta: "Parameters" },
  { id: "ssl", etiqueta: "SSL" },
  { id: "avanzado", etiqueta: "Advanced" },
];

const GRID = "grid grid-cols-1 items-center gap-x-3 gap-y-3 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,240px)]";

// Ventana "Setup New Connection". Solo visual: los campos no se guardan todavía.
export function DialogoConexion() {
  const [pestana, setPestana] = useState<Pestana>("parametros");

  return (
    <div
      role="dialog"
      aria-labelledby="titulo-conexion"
      className="bisel-panel flex w-full max-w-4xl flex-col gap-4 border-[3px] border-black bg-mc-panel p-5 text-mc-tinta"
    >
      <h1 id="titulo-conexion" className="font-pixel text-2xl text-mc-ayuda">
        Setup New Connection
      </h1>

      {/* Datos generales */}
      <div className={GRID}>
        <FilaCampo etiqueta="Connection Name" htmlFor="nombre" ayuda="Type a name for the connection">
          <input id="nombre" className={CAMPO} />
        </FilaCampo>
        <FilaCampo etiqueta="Connection Method" htmlFor="metodo" ayuda="Method to use to connect to the RDBMS">
          <select id="metodo" className={CAMPO}>
            <option>Standard (TCP/IP)</option>
            <option>Local Socket/Pipe</option>
            <option>Standard TCP/IP over SSH</option>
          </select>
        </FilaCampo>
      </div>

      {/* Pestañas */}
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
                  activa ? "top-0.5 bg-mc-panel" : "bg-mc-casilla hover:bg-[#9b9b9b]"
                }`}
              >
                {p.etiqueta}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${pestana}`}
          aria-labelledby={`tab-${pestana}`}
          className="min-h-[300px] border-2 border-black bg-mc-panel p-5"
        >
          {pestana === "parametros" && <PanelParametros />}
          {pestana === "ssl" && <PanelSsl />}
          {pestana === "avanzado" && <PanelAvanzado />}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-wrap items-center gap-3">
        <BotonMc variante="claro">Configure server management</BotonMc>
        <span className="flex-1" />
        <BotonMc variante="claro">Test Connection</BotonMc>
        <BotonMc variante="claro" href="/">Cancel</BotonMc>
        <BotonMc variante="claro" href="/" className="min-w-16">OK</BotonMc>
      </div>
    </div>
  );
}

function PanelParametros() {
  return (
    <div className={GRID}>
      <FilaCampo etiqueta="Hostname" htmlFor="host" ayuda="Name or IP address of the server host - and TCP/IP port.">
        <input id="host" className={CAMPO} />
        <label htmlFor="puerto" className="text-xl">Port:</label>
        <input id="puerto" defaultValue="3306" className={`${CAMPO} max-w-24`} />
      </FilaCampo>
      <FilaCampo etiqueta="Username" htmlFor="usuario" ayuda="Name of the user to connect with.">
        <input id="usuario" className={CAMPO} />
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
        <input id="esquema" className={CAMPO} />
      </FilaCampo>
    </div>
  );
}

function CampoArchivo({ id, etiqueta, ayuda }: { id: string; etiqueta: string; ayuda: string }) {
  return (
    <FilaCampo etiqueta={etiqueta} htmlFor={id} ayuda={ayuda}>
      <input id={id} className={CAMPO} />
      <BotonMc variante="claro" aria-label={`Buscar archivo para ${etiqueta}`} className="h-9 px-3">
        ...
      </BotonMc>
    </FilaCampo>
  );
}

function PanelSsl() {
  return (
    <div className={GRID}>
      <FilaCampo etiqueta="Use SSL" htmlFor="usar-ssl" ayuda="Turns on SSL encryption. Connection will fail if SSL is not available.">
        <select id="usar-ssl" className={CAMPO}>
          <option>No</option>
          <option>If available</option>
          <option>Require</option>
          <option>Require and Verify CA</option>
          <option>Require and Verify Identity</option>
        </select>
      </FilaCampo>
      <CampoArchivo id="ssl-key" etiqueta="SSL Key File" ayuda="Path to Client Key file for SSL." />
      <CampoArchivo id="ssl-cert" etiqueta="SSL CERT File" ayuda="Path to Client Certificate file for SSL." />
      <CampoArchivo id="ssl-ca" etiqueta="SSL CA File" ayuda="Path to Certificate Authority file for SSL." />
      <FilaCampo etiqueta="SSL Cipher" htmlFor="ssl-cipher" ayuda="Optional: separated list of permissible ciphers to use for SSL encryption.">
        <input id="ssl-cipher" className={CAMPO} />
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
        <input id={id} type="checkbox" className="h-5 w-5 accent-mc-seleccion" />
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
        <input id="timeout" defaultValue="60" className={CAMPO} />
      </FilaCampo>
      <FilaCampo etiqueta="MCQL_MODE" htmlFor="modo" ayuda="Override the default MCQL_MODE used by the server.">
        <input id="modo" className={CAMPO} />
      </FilaCampo>
      <FilaCampo
        etiqueta="Others"
        htmlFor="otros"
        ayuda="Other options for Connector/C++ as option=value pairs, one per line."
      >
        <textarea id="otros" rows={5} className={`${CAMPO} h-auto py-1`} />
      </FilaCampo>
    </div>
  );
}
