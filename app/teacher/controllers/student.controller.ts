"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil siswa berdasarkan ID siswa.
 * @param studentIds - Array dari ID siswa yang akan dicari.
 * @returns Array dari objek siswa yang sesuai dengan ID yang diberikan.
 */
export async function getStudentsByIds(studentIds: number[]) {
  try {
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds, // Filter berdasarkan ID siswa
        },
      },
    });

    return students;
  } catch (error) {
    console.error("Failed to fetch students by IDs:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch students by IDs"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
