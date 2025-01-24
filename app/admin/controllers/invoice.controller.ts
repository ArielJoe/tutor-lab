"use server";

import prisma from "@/app/lib/db";
import { addSelectedCourse } from "./selected_course.controller";

/**
 * Membuat invoice dari kontrak studi untuk seorang siswa.
 * @param studentId - ID siswa yang terkait dengan invoice.
 * @param totalAmount - Jumlah total yang harus dibayar.
 * @param paymentMethod - Metode pembayaran (Transfer Bank atau Tunai).
 * @returns Invoice yang baru dibuat.
 */
export const createInvoiceFromStudyContract = async (
  studentId: number,
  totalAmount: number,
  paymentMethod: "Transfer" | "Cash"
) => {
  try {
    // Membuat invoice baru
    const invoice = await prisma.invoice.create({
      data: {
        created_at: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: "Pending",
        amount: totalAmount,
        method: paymentMethod,
        Student_id: studentId,
      },
    });

    // Mengambil kontrak studi untuk siswa dengan kursus unik
    const studyContracts = await prisma.studyContract.findMany({
      where: {
        Student_id: studentId,
      },
      include: {
        schedule: {
          include: {
            course: true,
          },
        },
      },
    });

    // Menyimpan course_id yang sudah ditambahkan untuk menghindari duplikasi
    const uniqueCourses = new Map<string, number>();

    // Menambahkan kursus unik untuk setiap kontrak studi
    for (const contract of studyContracts) {
      if (contract.schedule?.course) {
        const courseName = contract.schedule.course.course_name;
        const coursePrice = contract.schedule.course.price || 0;

        // Hanya tambahkan jika course name belum pernah ditambahkan sebelumnya
        if (!uniqueCourses.has(courseName)) {
          await addSelectedCourse(contract.schedule.course.id, invoice.id);
          uniqueCourses.set(courseName, coursePrice);
        }
      }
    }

    return invoice;
  } catch (error) {
    console.error("Failed to make invoice:", error);
    throw new Error("Failed to make invoice");
  }
};

/**
 * Menghapus invoice dan catatan terkait (SelectedCourse) berdasarkan ID invoice.
 * @param invoiceId - ID invoice yang akan dihapus.
 * @returns Boolean yang menandakan keberhasilan operasi.
 */
export const deleteInvoice = async (invoiceId: number) => {
  try {
    // Langkah 1: Menghapus semua catatan SelectedCourse yang terkait
    await prisma.selectedCourse.deleteMany({
      where: { Invoice_id: invoiceId },
    });

    // Langkah 2: Menghapus invoice
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return true; // Menandakan operasi berhasil
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    throw new Error("Failed to delete invoice");
  }
};

/**
 * Mengonfirmasi pembayaran untuk sebuah invoice.
 * @param invoiceId - ID invoice yang akan dikonfirmasi.
 * @returns Invoice yang telah diperbarui.
 */
export async function confirmPayment(invoiceId: number) {
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "Paid" }, // Mengubah status menjadi "Paid"
    });
    return updatedInvoice;
  } catch (error) {
    console.error("Failed to confirm payment:", error);
    throw new Error("Failed to confirm payment");
  }
}

/**
 * Membatalkan konfirmasi pembayaran untuk sebuah invoice.
 * @param invoiceId - ID invoice yang akan dibatalkan.
 * @returns Invoice yang telah diperbarui.
 */
export async function cancelPayment(invoiceId: number) {
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "Pending" }, // Mengubah status kembali menjadi "Pending"
    });
    return updatedInvoice;
  } catch (error) {
    console.error("Failed to cancel payment:", error);
    throw new Error("Failed to cancel payment");
  }
}

/**
 * Mengambil semua invoice dari database, termasuk detail siswa dan kursus yang dipilih.
 * @returns Array dari objek invoice.
 */
export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
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
    console.error("Failed to fetch invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}
