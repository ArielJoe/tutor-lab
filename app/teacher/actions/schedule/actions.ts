"use server";

import prisma from "@/app/lib/db";

export async function getSchedulesForTeacher(teacherId: number) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        Teacher_id: teacherId, // Filter by teacher_id
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
