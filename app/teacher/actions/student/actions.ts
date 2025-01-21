"use server";

import prisma from "@/app/lib/db";

export async function getStudentsByIds(studentIds: number[]) {
  try {
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds, // Filter by Student IDs
        },
      },
    });

    return students;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw new Error("Failed to fetch students.");
  } finally {
    await prisma.$disconnect();
  }
}
