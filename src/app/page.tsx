import { BarraLateral } from "@/components/BarraLateral";
import { BarraMenus } from "@/components/BarraMenus";
import { BarraPestanas } from "@/components/BarraPestanas";
import { BotonMc } from "@/components/BotonMc";
import { TarjetaConexion } from "@/components/TarjetaConexion";
import { CONEXIONES_DEMO } from "@/lib/datos-demo";

export default function Inicio() {
  return (
    <div className="flex min-h-screen flex-col">
      <BarraPestanas />
      <BarraMenus />

      <div className="flex flex-1">
        <BarraLateral activa="conexiones" />

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Portada: pon tu imagen en public/hero.jpg. Sin imagen se ve tierra. */}
          <section className="textura-tierra relative flex min-h-[360px] items-start justify-center overflow-hidden border-b-4 border-black px-6 pt-12 text-center">
            <div aria-hidden="true" className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />
            <h1 className="sombra-titulo relative max-w-4xl font-pixel text-5xl font-bold leading-tight text-white md:text-7xl">
              Welcome to MCQL Workbench
            </h1>
          </section>

          {/* Conexiones */}
          <section className="textura-piedra flex flex-1 flex-col gap-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-pixel text-2xl text-white [text-shadow:3px_3px_0_#2a2a2a]">
                  My MCQL Connections
                </h2>
                <BotonMc href="/conexion/nueva" aria-label="Nueva conexión" className="w-10 px-0 font-pixel">
                  +
                </BotonMc>
                <BotonMc aria-label="Quitar conexión" className="w-10 px-0 font-pixel">
                  −
                </BotonMc>
              </div>
              <label className="flex items-center">
                <span className="sr-only">Buscar conexiones</span>
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="bisel-casilla h-10 w-56 bg-mc-casilla px-3 text-xl text-mc-tinta placeholder:text-[#3f3f3f] outline-none"
                />
              </label>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
              {CONEXIONES_DEMO.map((c) => (
                <TarjetaConexion key={c.id} conexion={c} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
