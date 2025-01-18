"use server";

import prisma from "@/app/lib/db";

export async function getSchedulesByTeacherId(teacherId: number) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        Teacher_id: teacherId,
      },
      include: {
        period: true, // Include Period details
        course: true, // Include Course details
        teacher: true, // Include Teacher details
      },
    });
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    throw new Error("Failed to fetch schedules.");
  } finally {
    await prisma.$disconnect();
  }
}
