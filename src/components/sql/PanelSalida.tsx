import type { EntradaSalida } from "@/lib/datos/tipos";
import { EstadoVacio } from "../EstadoVacio";
import { IconoCorrecto, IconoError } from "../IconosPixel";

export function PanelSalida({ salida }: { salida: EntradaSalida[] }) {
  return (
    <section aria-label="Output" className="border-t-4 border-black">
      <div className="textura-piedra border-b-[3px] border-black px-3 py-1.5">
        <h2 className="sombra-texto font-pixel text-lg text-white">Output · Action Output</h2>
      </div>
      <div className="max-h-48 overflow-auto bg-mc-consola">
        {salida.length === 0 ? (
          <EstadoVacio texto="Sin acciones" />
        ) : (
          <table className="w-full min-w-[620px] border-collapse text-lg text-mc-suave">
            <thead>
              <tr className="text-left text-[#8f8f8f]">
                <th scope="col" className="w-8 px-3 py-1">
                  <span className="sr-only">Estado</span>
                </th>
                <th scope="col" className="w-10 px-3 py-1">#</th>
                <th scope="col" className="w-24 px-3 py-1">Time</th>
                <th scope="col" className="px-3 py-1">Action</th>
                <th scope="col" className="w-52 px-3 py-1">Message</th>
                <th scope="col" className="w-44 px-3 py-1">Duration / Fetch</th>
              </tr>
            </thead>
            <tbody>
              {salida.map((s) => (
                <tr key={s.numero}>
                  <td className="px-3 py-1">
                    {s.correcto ? <IconoCorrecto /> : <IconoError />}
                    <span className="sr-only">{s.correcto ? "Correcto" : "Error"}</span>
                  </td>
                  <td className="px-3 py-1">{s.numero}</td>
                  <td className="px-3 py-1">{s.hora}</td>
                  <td className="max-w-px truncate px-3 py-1">{s.accion}</td>
                  <td className="px-3 py-1">{s.mensaje}</td>
                  <td className="px-3 py-1">{s.duracion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
