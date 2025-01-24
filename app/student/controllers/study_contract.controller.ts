"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil kontrak studi berdasarkan ID siswa.
 * @param studentId - ID siswa yang terkait dengan kontrak studi.
 * @returns Array dari objek kontrak studi beserta detail jadwal, kursus, dan guru.
 */
export async function getStudyContractsByStudentId(
  studentId: number
): Promise<any[]> {
  try {
    const studyContracts = await prisma.studyContract.findMany({
      where: { Student_id: studentId },
      include: {
        schedule: {
          include: {
            course: true, // Menyertakan detail kursus
            teacher: true, // Menyertakan detail guru
          },
        },
      },
    });

    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch study contracts by student ID:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch study contracts by student ID"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil semua kontrak studi dari database.
 * @returns Array dari objek kontrak studi.
 */
export async function getAllStudyContracts() {
  try {
    const studyContracts = await prisma.studyContract.findMany();
    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch all study contracts:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch all study contracts"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
