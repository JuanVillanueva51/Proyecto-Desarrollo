# MCQL Workbench

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Prisma.

## Cómo correrlo

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

## Pantallas

| Ruta | Pantalla |
|---|---|
| `/` | Inicio |
| `/conexion/nueva` | Setup New Connection |
| `/conexion/[id]/editor` | SQL Editor (solo lectura) con el Constructor de consultas flotante |
| `/conexion/[id]/diagrama` | EER Diagram (vista Misiones y Clásica) |

## Dimensiones

Overworld, Nether y The End. Se eligen en la ventana de Configuración (engrane o Edit → Preferences...) y se guardan en la cookie `dimension`.
Los colores y texturas de cada una están en `src/app/globals.css`.

Portadas de Inicio: `public/hero.jpg`, `public/hero-nether.jpg` y `public/hero-end.jpg`.

## Datos

Todas las pantallas leen de `src/lib/datos/fuente.ts`. Hoy esas funciones regresan vacío;
ahí se conecta la lógica de SQL → JSON → tablas. Los tipos están en `src/lib/datos/tipos.ts`.
