"use server";

import prisma from "@/app/lib/db";

/**
 * Mengambil invoice berdasarkan ID siswa.
 * @param studentId - ID siswa yang terkait dengan invoice.
 * @returns Array dari objek invoice beserta detail siswa dan kursus yang dipilih.
 */
export async function getInvoicesByStudentId(studentId: number) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { Student_id: studentId },
      include: {
        student: true, // Menyertakan detail siswa
        selectedCourses: {
          include: {
            course: true, // Menyertakan detail kursus untuk setiap kursus yang dipilih
          },
        },
      },
    });

    return invoices;
  } catch (error) {
    console.error("Failed to fetch invoices by student ID:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch invoices by student ID"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
