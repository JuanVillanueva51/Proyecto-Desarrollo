# MCQL Workbench

Proyecto base con **Next.js (App Router) + TypeScript + Tailwind CSS v4 + Prisma**.
Por ahora solo muestra las pantallas del diseño de Figma, sin lógica real.

## Cómo correrlo

```bash
npm install                # instala todo y genera el cliente de Prisma
cp .env.example .env       # en Windows: copy .env.example .env
npm run db:push            # crea la base SQLite de la app (prisma/dev.db)
npm run db:seed            # opcional: mete 4 conexiones de ejemplo
npm run dev                # abre http://localhost:3000
```

Las pantallas usan datos de ejemplo (`src/lib/datos-demo.ts`), así que se ven aunque no
hayas hecho los pasos de la base de datos.

## Pantallas

| Ruta | Qué muestra |
|---|---|
| `/` | Bienvenida: portada, barra lateral, menús desplegables y tarjetas de conexión |
| `/conexion/nueva` | Setup New Connection con las pestañas Parameters, SSL y Advanced (se abre con el botón **+**) |

**Imagen de la portada:** coloca tu imagen en `public/hero.jpg`. Si no existe, se ve la textura de tierra.

## Estructura

```
prisma/
  schema.prisma        modelos Conexion y Proyecto (datos propios de la app)
  seed.ts              conexiones de ejemplo
src/
  app/
    globals.css        tema de bloques: colores, texturas y biseles
    layout.tsx         fuentes pixeladas (Pixelify Sans y VT323)
    page.tsx           pantalla de bienvenida
    conexion/nueva/    pantalla de nueva conexión
  components/
    BarraPestanas      franja superior con la pestaña de inicio
    BarraMenus         menús File, Edit, View... (abren y cierran)
    BarraLateral       casillas de secciones
    TarjetaConexion    tarjeta de cada conexión
    DialogoConexion    ventana con pestañas
    FilaCampo          fila etiqueta | campo | ayuda
    BotonMc            botón con relieve (oscuro, claro, verde)
    IconosPixel        íconos en pixel art
  lib/
    menus.ts           contenido de los menús
    datos-demo.ts      datos de ejemplo
    prisma.ts          cliente de Prisma compartido
```

## Clases del tema (en `globals.css`)

- **Colores:** `bg-mc-panel`, `bg-mc-boton`, `bg-mc-casilla`, `text-mc-tinta`, `text-mc-ayuda`, `bg-mc-seleccion`…
- **Texturas:** `textura-piedra`, `textura-pizarra`, `textura-tierra`, `textura-tablones`
- **Relieve:** `bisel-boton`, `bisel-boton-claro`, `bisel-casilla`, `bisel-panel`
- **Fuentes:** `font-pixel` (títulos) y `font-term` (texto, es la de por defecto)

## Siguientes pasos

1. Cambiar `CONEXIONES_DEMO` por `await prisma.conexion.findMany()` en `src/app/page.tsx`.
2. Guardar el formulario de nueva conexión con una Server Action y `prisma.conexion.create()`.
3. Instalar `mysql2` para crear las bases a partir del JSON y para el constructor de consultas.
