"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil ID siswa berdasarkan email.
 * @param email - Email siswa yang akan dicari.
 * @returns ID siswa sebagai number, atau null jika siswa tidak ditemukan.
 */
export async function getStudentIdByEmail(
  email: string
): Promise<number | null> {
  try {
    const student = await prisma.student.findUnique({
      where: { email },
      select: { id: true }, // Hanya mengambil ID siswa
    });

    return student ? student.id : null; // Mengembalikan ID siswa atau null jika tidak ditemukan
  } catch (error) {
    console.error("Failed to fetch student ID by email:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch student ID by email"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
