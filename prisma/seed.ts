import { PrismaClient } from "@prisma/client";
import { CONEXIONES_DEMO } from "../src/lib/datos-demo";

const prisma = new PrismaClient();

async function main() {
  await prisma.conexion.deleteMany();
  for (const c of CONEXIONES_DEMO) {
    await prisma.conexion.create({
      data: { nombre: c.nombre, usuario: c.usuario, host: c.host, puerto: c.puerto },
    });
  }
  console.log(`Sembradas ${CONEXIONES_DEMO.length} conexiones de ejemplo`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
