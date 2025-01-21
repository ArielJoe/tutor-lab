"use server";

import prisma from "@/app/lib/db";

export async function getStudyContracts() {
  try {
    const studyContracts = await prisma.studyContract.findMany();

    return studyContracts;
  } catch (error) {
    console.error("Failed to fetch schedules and students:", error);
    throw new Error("Failed to fetch schedules and students.");
  } finally {
    await prisma.$disconnect();
  }
}
