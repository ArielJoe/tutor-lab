"use server";

import prisma from "@/app/lib/db";

export async function getStudyContractsByStudentId(
  studentId: number
): Promise<any[]> {
  try {
    const studyContracts = await prisma.studyContract.findMany({
      where: { Student_id: studentId },
      include: {
        schedule: {
          include: {
            course: true,
            teacher: true,
          },
        },
      },
    });

    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch study contracts:", error);
    throw new Error("Failed to fetch study contracts");
  }
}

export async function getAllStudyContracts() {
  try {
    const studyContracts = await prisma.studyContract.findMany();
    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch study contracts:", error);
    throw new Error("Failed to fetch study contracts.");
  } finally {
    await prisma.$disconnect();
  }
}
