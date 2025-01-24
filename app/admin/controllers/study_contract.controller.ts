"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil kontrak studi berdasarkan ID siswa.
 * @param studentId - ID siswa yang terkait dengan kontrak studi.
 * @returns Array dari objek kontrak studi.
 */
export async function getStudyContractByStudentId(studentId: number) {
  try {
    const studyContracts = await prisma.studyContract.findMany({
      where: { Student_id: studentId },
      include: {
        schedule: {
          include: {
            teacher: true, // Menyertakan data guru
            course: true, // Menyertakan data kursus
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
 * Menghapus kontrak studi berdasarkan ID.
 * @param contractId - ID kontrak studi yang akan dihapus.
 * @returns Objek kontrak studi yang dihapus.
 */
export async function deleteStudyContract(contractId: number) {
  try {
    return await prisma.studyContract.delete({
      where: { id: contractId },
    });
  } catch (error) {
    console.error("Failed to delete study contract:", error); // Mencetak error ke konsol
    throw new Error("Failed to delete study contract"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Membuat kontrak studi baru.
 * @param data - Objek yang berisi detail kontrak studi (ID jadwal, ID periode, ID guru, ID kursus, ID siswa).
 * @returns Objek kontrak studi yang baru dibuat.
 */
export async function createStudyContract(data: {
  scheduleId: number;
  schedulePeriodId: number;
  scheduleTeacherId: number;
  scheduleCourseId: number;
  studentId: number;
}) {
  try {
    return await prisma.studyContract.create({
      data: {
        Schedule_id: data.scheduleId,
        Schedule_Period_id: data.schedulePeriodId,
        Schedule_Teacher_id: data.scheduleTeacherId,
        Schedule_Course_id: data.scheduleCourseId,
        Student_id: data.studentId,
      },
    });
  } catch (error) {
    console.error("Failed to create study contract:", error); // Mencetak error ke konsol
    throw new Error("Failed to create study contract"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
