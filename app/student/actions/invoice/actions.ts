"use server";

import prisma from "@/app/lib/db";

export async function getInvoicesByStudentId(studentId: number) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { Student_id: studentId },
      include: {
        student: true, // Include student details
        selectedCourses: {
          include: {
            course: true, // Include course details for each selected course
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
