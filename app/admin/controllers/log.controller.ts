"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil semua log dari database, diurutkan berdasarkan waktu perubahan terbaru.
 * @returns Array dari objek log.
 */
export async function getLogs() {
  try {
    // Mengambil semua log dari database dan mengurutkannya berdasarkan waktu perubahan terbaru
    const logs = await prisma.log.findMany({
      orderBy: {
        changed_at: "desc", // Urutkan berdasarkan waktu perubahan terbaru
      },
    });
    return logs;
  } catch (error) {
    console.error("Failed to fetch logs:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch logs"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
