"use server";

import prisma from "@/app/lib/db";
import { Schedule } from "@prisma/client";

export async function getSchedulesByTeacherId(
  teacherId: number
): Promise<Schedule[]> {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { Teacher_id: teacherId },
      include: {
        period: true,
        course: true,
      },
    });
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    throw new Error("Failed to fetch schedules");
  }
}

export async function createSchedule(data: any) {
  const schedule = await prisma.schedule.create({
    data: data,
  });
  return schedule;
}

export async function getSchedules(): Promise<Schedule[]> {
  try {
    const schedules = await prisma.schedule.findMany();
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    throw new Error("Failed to fetch schedules.");
  }
}

export async function updateSchedule(schedule: Schedule): Promise<void> {
  try {
    await prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        day: schedule.day,
        start_time: schedule.start_time,
        duration: schedule.duration,
        Period_id: schedule.Period_id,
        Teacher_id: schedule.Teacher_id,
        Course_id: schedule.Course_id,
      },
    });
  } catch (error) {
    console.error("Failed to update schedule:", error);
    throw new Error("Failed to update schedule.");
  }
}

export async function deleteScheduleById(id: number): Promise<void> {
  try {
    await prisma.schedule.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    throw new Error("Failed to delete schedule.");
  }
}

export async function getSchedulesTeacherCourse(): Promise<Schedule[]> {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        teacher: {
          select: {
            name: true, // Include teacher name
          },
        },
        course: {
          select: {
            course_name: true, // Include course name
          },
        },
      },
    });
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    throw new Error("Failed to fetch schedules.");
  }
}
