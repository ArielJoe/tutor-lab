"use server";

import prisma from "@/app/lib/db";

export async function getStudyContractsByStudentId(studentId: number) {
  try {
    const studyContracts = await prisma.studyContract.findMany({
      where: {
        Student_id: studentId,
      },
      include: {
        schedule: {
          include: {
            course: true, // Include Course details
            teacher: true, // Include Teacher details
          },
        },
      },
    });
    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch study contracts:", error);
    throw new Error("Failed to fetch study contracts.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllStudyContracts() {
  try {
    const studyContracts = await prisma.studyContract.findMany({
      include: {
        // Include related data if needed (e.g., Schedule, Teacher, Course)
      },
    });
    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch study contracts:", error);
    throw new Error("Failed to fetch study contracts.");
  } finally {
    await prisma.$disconnect();
  }
}
