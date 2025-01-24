"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil ID guru berdasarkan email.
 * @param email - Email guru yang akan dicari.
 * @returns ID guru sebagai number, atau null jika guru tidak ditemukan.
 */
export async function getTeacherIdByEmail(
  email: string
): Promise<number | null> {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { email },
      select: { id: true }, // Hanya mengambil ID guru
    });

    return teacher ? teacher.id : null; // Mengembalikan ID guru atau null jika tidak ditemukan
  } catch (error) {
    console.error("Failed to fetch teacher ID by email:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch teacher ID by email"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
