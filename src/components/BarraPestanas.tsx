import Link from "next/link";
import { BloquePasto } from "./IconosPixel";

// Franja superior con las pestañas abiertas (por ahora solo Inicio).
export function BarraPestanas() {
  return (
    <div className="flex items-end gap-1 bg-gradient-to-b from-[#e2e2e2] to-[#bdbdbd] px-2 pt-1">
      <Link
        href="/"
        aria-label="Inicio"
        className="flex h-7 w-10 items-center justify-center border-2 border-b-0 border-[#7a7a7a] bg-[#d0d0d0]"
      >
        <BloquePasto tamano={18} />
      </Link>
    </div>
  );
}
