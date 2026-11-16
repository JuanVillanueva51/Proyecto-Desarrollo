// Menús de la barra superior, tomados del diseño de Figma.

export type ItemMenu =
  | { tipo?: "item"; etiqueta: string; atajo?: string; submenu?: boolean }
  | { tipo: "separador" };

export type Menu = { nombre: string; items: ItemMenu[] };

const SEP: ItemMenu = { tipo: "separador" };

export const MENUS: Menu[] = [
  {
    nombre: "File",
    items: [
      { etiqueta: "New Model", atajo: "Ctrl+N" },
      { etiqueta: "New Query Tab...", atajo: "Ctrl+T" },
      { etiqueta: "Open Model...", atajo: "Ctrl+O" },
      { etiqueta: "Open MCQL Script...", atajo: "Ctrl+Shift+O" },
      { etiqueta: "Open Recent", submenu: true },
      SEP,
      { etiqueta: "Close Tab", atajo: "Ctrl+W" },
      { etiqueta: "Exit", atajo: "Alt+F4" },
    ],
  },
  {
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
      { etiqueta: "Preferences..." },
    ],
  },
  {
    nombre: "View",
    items: [
      { etiqueta: "Home" },
      { etiqueta: "Select Next Main Tab", atajo: "Alt+Shift+Right" },
      { etiqueta: "Select Previous Main Tab", atajo: "Alt+Shift+Left" },
    ],
  },
  // Los siguientes no estaban en Figma: quedan con opciones de ejemplo.
  {
    nombre: "Database",
    items: [
      { etiqueta: "Connect to Database...", atajo: "Ctrl+U" },
      { etiqueta: "Manage Connections..." },
      SEP,
      { etiqueta: "Create Database from JSON..." },
    ],
  },
  { nombre: "Tools", items: [{ etiqueta: "Configuration", submenu: true }] },
  { nombre: "Scripting", items: [{ etiqueta: "Scripting Shell..." }] },
  { nombre: "Help", items: [{ etiqueta: "About MCQL Workbench" }] },
];
