"use server";

import prisma from "@/app/lib/db";
import { addSelectedCourse } from "../selected_course/actions";

export const createInvoiceFromStudyContract = async (
  studentId: number,
  totalAmount: number
) => {
  try {
    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        created_at: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)), // Due in 7 days
        status: "Pending",
        amount: totalAmount,
        method: "Bank Transfer", // Default method
        Student_id: studentId, // Link the invoice to the student
      },
    });

    // Fetch study contracts for the student
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

    // Add selected courses for each study contract
    for (const contract of studyContracts) {
      if (contract.schedule?.course) {
        await addSelectedCourse(
          contract.schedule.course.id, // course_id
          invoice.id // invoice_id
        );
      }
    }

    return invoice;
  } catch (error) {
    console.error("Failed to create invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async (invoiceId: number) => {
  try {
    // Step 1: Delete all related SelectedCourse records
    await prisma.selectedCourse.deleteMany({
      where: { Invoice_id: invoiceId },
    });

    // Step 2: Delete the invoice
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return true; // Indicate success
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    throw new Error("Failed to delete invoice");
  }
};

export async function confirmPayment(invoiceId: number) {
  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "Paid" },
  });
  return updatedInvoice;
}

export async function cancelPayment(invoiceId: number) {
  return await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "Pending" },
  });
}

export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
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
    throw new Error("Failed to fetch invoices.");
  }
}
