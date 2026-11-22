import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Pixelify_Sans, VT323 } from "next/font/google";
import { COOKIE_DIMENSION, esDimension } from "@/lib/dimension";
import "./globals.css";

const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify" });
const term = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323" });

export const metadata: Metadata = {
  title: "MCQL Workbench",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const guardada = (await cookies()).get(COOKIE_DIMENSION)?.value;
  const dimension = esDimension(guardada) ? guardada : "overworld";

  return (
    <html lang="es" data-dimension={dimension} className={`${pixel.variable} ${term.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
