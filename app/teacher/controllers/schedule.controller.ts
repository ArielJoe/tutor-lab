"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil jadwal berdasarkan ID guru.
 * @param teacherId - ID guru yang terkait dengan jadwal.
 * @returns Array dari objek jadwal beserta detail kursus dan guru.
 */
export async function getSchedulesByTeacherId(teacherId: number) {
  try {
    // Mengambil semua jadwal untuk guru yang diberikan
    const schedules = await prisma.schedule.findMany({
      where: {
        Teacher_id: teacherId,
      },
      include: {
        course: true, // Menyertakan detail kursus
        teacher: true, // Menyertakan detail guru
      },
    });

    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules by teacher ID:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch schedules by teacher ID"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
