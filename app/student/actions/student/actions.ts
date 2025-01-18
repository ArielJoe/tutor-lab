"use server";

import prisma from "@/app/lib/db";

export async function getStudentIdByEmail(
  email: string
): Promise<number | null> {
  try {
    const student = await prisma.student.findUnique({
      where: { email },
      select: { id: true },
    });

    return student ? student.id : null;
  } catch (error) {
    console.error("Failed to fetch student ID:", error);
    throw new Error("Failed to fetch student ID");
  }
}
