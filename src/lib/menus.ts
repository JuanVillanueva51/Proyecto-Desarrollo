import type { NombreVentana } from "./eventos";

export type ItemMenu =
  | { tipo?: "item"; etiqueta: string; atajo?: string; submenu?: boolean; href?: string; ventana?: NombreVentana }
  | { tipo: "separador" };

export type Menu = { nombre: string; items: ItemMenu[] };

export type ConjuntoMenus = "inicio" | "sql" | "diagrama";

const SEP: ItemMenu = { tipo: "separador" };

const FILE: Menu = {
  nombre: "File",
  items: [
    { etiqueta: "New Model", atajo: "Ctrl+N" },
    { etiqueta: "New Query Tab...", atajo: "Ctrl+T" },
    { etiqueta: "Open Model...", atajo: "Ctrl+O" },
    { etiqueta: "Open MCQL Script...", atajo: "Ctrl+Shift+O", ventana: "importar" },
    { etiqueta: "Open Recent", submenu: true },
    SEP,
    { etiqueta: "Close Tab", atajo: "Ctrl+W" },
    { etiqueta: "Exit", atajo: "Alt+F4" },
  ],
};

const EDIT: Menu = {
  nombre: "Edit",
  items: [
    { etiqueta: "Undo", atajo: "Ctrl+Z" },
    { etiqueta: "Redo", atajo: "Ctrl+Y" },
    SEP,
    { etiqueta: "Cut", atajo: "Ctrl+X" },
    { etiqueta: "Copy", atajo: "Ctrl+C" },
    { etiqueta: "Paste", atajo: "Ctrl+V" },
    { etiqueta: "Delete" },
    SEP,
    { etiqueta: "Select All", atajo: "Ctrl+A" },
    SEP,
    { etiqueta: "Find", submenu: true },
    SEP,
    { etiqueta: "Preferences...", ventana: "configuracion" },
  ],
};

const VIEW: Menu = {
  nombre: "View",
  items: [
    { etiqueta: "Home", href: "/" },
    { etiqueta: "Select Next Main Tab", atajo: "Alt+Shift+Right" },
    { etiqueta: "Select Previous Main Tab", atajo: "Alt+Shift+Left" },
  ],
};

const QUERY: Menu = {
  nombre: "Query",
  items: [
    { etiqueta: "Execute (All or Selection)", atajo: "Ctrl+Shift+Enter" },
    { etiqueta: "Execute Current Statement", atajo: "Ctrl+Enter" },
    { etiqueta: "Explain Current Statement", atajo: "Ctrl+Alt+X" },
    { etiqueta: "Stop" },
    SEP,
    { etiqueta: "Commit Transaction" },
    { etiqueta: "Rollback Transaction" },
    SEP,
    { etiqueta: "Limit Rows", submenu: true },
  ],
};

const DATABASE: Menu = {
  nombre: "Database",
  items: [
    { etiqueta: "Connect to Database...", atajo: "Ctrl+U", ventana: "conexiones" },
    { etiqueta: "Manage Connections...", ventana: "conexiones" },
    SEP,
    { etiqueta: "Create Database from JSON...", ventana: "importar" },
  ],
};

const SERVER: Menu = {
  nombre: "Server",
  items: [
    { etiqueta: "Server Status" },
    { etiqueta: "Client Connections" },
    { etiqueta: "Users and Privileges" },
    SEP,
    { etiqueta: "Data Export", ventana: "exportar" },
    { etiqueta: "Data Import/Restore", ventana: "importar" },
  ],
};

const ARRANGE: Menu = {
  nombre: "Arrange",
  items: [
    { etiqueta: "Align to Grid" },
    { etiqueta: "Bring to Front" },
    { etiqueta: "Send to Back" },
    SEP,
    { etiqueta: "Reset Object Size" },
  ],
};

const MODEL: Menu = {
  nombre: "Model",
  items: [
    { etiqueta: "Add Diagram" },
    { etiqueta: "Create Diagram from Catalog Objects" },
    SEP,
    { etiqueta: "Model Options..." },
  ],
};

const TOOLS: Menu = { nombre: "Tools", items: [{ etiqueta: "Configuration", submenu: true }] };
const SCRIPTING: Menu = { nombre: "Scripting", items: [{ etiqueta: "Scripting Shell..." }] };
const HELP: Menu = { nombre: "Help", items: [{ etiqueta: "About MCQL Workbench" }] };

export const MENUS: Record<ConjuntoMenus, Menu[]> = {
  inicio: [FILE, EDIT, VIEW, DATABASE, TOOLS, SCRIPTING, HELP],
  sql: [FILE, EDIT, VIEW, QUERY, DATABASE, SERVER, TOOLS, SCRIPTING, HELP],
  diagrama: [FILE, EDIT, VIEW, ARRANGE, MODEL, DATABASE, TOOLS, SCRIPTING, HELP],
};
