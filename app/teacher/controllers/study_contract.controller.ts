"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil semua kontrak studi dari database.
 * @returns Array dari objek kontrak studi.
 */
export async function getStudyContracts() {
  try {
    const studyContracts = await prisma.studyContract.findMany();
    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch study contracts:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch study contracts"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
