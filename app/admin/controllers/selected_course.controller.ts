"use server";

import prisma from "@/app/lib/db";

/**
 * Menambahkan kursus yang dipilih ke dalam database.
 * @param course_id - ID kursus yang dipilih.
 * @param invoice_id - ID invoice yang terkait dengan kursus yang dipilih.
 * @returns Objek kursus yang dipilih yang baru dibuat.
 */
export const addSelectedCourse = async (
  course_id: number,
  invoice_id: number
) => {
  try {
    // Membuat entri baru untuk kursus yang dipilih
    const selectedCourse = await prisma.selectedCourse.create({
      data: {
        Course_id: course_id,
        Invoice_id: invoice_id,
      },
    });
    return selectedCourse;
  } catch (error) {
    console.error("Failed to add selected course:", error); // Mencetak error ke konsol
    throw new Error("Failed to add selected course"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
};
