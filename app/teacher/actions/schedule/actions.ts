"use server";

import prisma from "@/app/lib/db";

export async function getSchedulesByTeacherId(teacherId: number) {
  try {
    // Fetch all schedules for the given teacher
    const schedules = await prisma.schedule.findMany({
      where: {
        Teacher_id: teacherId,
      },
      include: {
        course: true, // Include Course details
        teacher: true, // Include Teacher details
      },
    });

    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules and students:", error);
    throw new Error("Failed to fetch schedules and students.");
  } finally {
    await prisma.$disconnect();
  }
}
