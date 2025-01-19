"use server";

import prisma from "@/app/lib/db";
import { Invoice } from "@/app/lib/interfaces";

export async function createInvoiceFromStudyContract(
  studentId: number,
  totalAmount: number
) {
  const invoice = await prisma.invoice.create({
    data: {
      created_at: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: "Pending", // Default status
      amount: totalAmount,
      method: "Transfer", // Default payment method
      Student_id: studentId,
    },
  });

  return invoice;
}

export const deleteInvoice = async (invoiceId: number) => {
  try {
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

export async function createInvoice(data: Invoice) {
  await prisma.invoice.create({
    data: {
      created_at: data.created_at,
      due_date: data.due_date,
      status: data.status,
      amount: data.amount,
      method: data.method,
      Student_id: data.Student_id,
    },
  });
}

export async function getInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      student: true, // Include the student relation to display student details
    },
  });
  return invoices;
}
