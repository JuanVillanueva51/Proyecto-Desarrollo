import { BarraLateral } from "@/components/BarraLateral";
import { BotonVentana } from "@/components/BotonVentana";
import { EstadoVacio } from "@/components/EstadoVacio";
import { MarcoPantalla } from "@/components/MarcoPantalla";
import { TarjetaConexion } from "@/components/TarjetaConexion";
import { obtenerConexiones } from "@/lib/datos/fuente";

export default async function Inicio() {
  const conexiones = await obtenerConexiones();

  return (
    <MarcoPantalla conjunto="inicio" activa="inicio">
      <div className="flex flex-1">
        <BarraLateral />

        <main className="flex min-w-0 flex-1 flex-col">
          <section className="textura-suelo relative flex min-h-[360px] items-start justify-center overflow-hidden border-b-4 border-black px-6 pt-12 text-center">
            <div aria-hidden="true" className="absolute inset-0 bg-[image:var(--d-portada)] bg-cover bg-center" />
            <h1 className="sombra-titulo relative max-w-4xl font-pixel text-5xl font-bold leading-tight text-white md:text-7xl">
              Welcome to MCQL Workbench
            </h1>
          </section>

          <section className="textura-piedra flex flex-1 flex-col gap-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="sombra-texto font-pixel text-2xl text-white">My MCQL Connections</h2>
                <BotonVentana ventana="conexion" aria-label="Nueva conexión" className="w-10 px-0 font-pixel">
                  +
                </BotonVentana>
                <BotonVentana ventana="conexiones" aria-label="Administrar conexiones" className="w-10 px-0 font-pixel">
                  −
                </BotonVentana>
                <BotonVentana ventana="importar">Importar JSON</BotonVentana>
              </div>
              <label className="flex items-center">
                <span className="sr-only">Buscar conexiones</span>
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="bisel-casilla h-10 w-56 bg-mc-casilla px-3 text-xl text-mc-tinta outline-none placeholder:text-mc-ayuda"
                />
              </label>
            </div>

            {conexiones.length === 0 ? (
              <EstadoVacio texto="Sin conexiones" />
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
                {conexiones.map((c) => (
                  <TarjetaConexion key={c.id} conexion={c} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </MarcoPantalla>
  );
}
