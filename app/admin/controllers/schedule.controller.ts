"use server";

import prisma from "@/app/lib/db";
import { Schedule } from "@prisma/client";

/**
 * Mengambil jadwal berdasarkan ID guru.
 * @param teacherId - ID guru yang terkait dengan jadwal.
 * @returns Array dari objek jadwal (Schedule).
 */
export async function getSchedulesByTeacherId(
  teacherId: number
): Promise<Schedule[]> {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { Teacher_id: teacherId },
      include: {
        period: true, // Menyertakan data periode
        course: true, // Menyertakan data kursus
      },
    });
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules by teacher ID:", error);
    throw new Error("Failed to fetch schedules by teacher ID");
  }
}

/**
 * Membuat jadwal baru.
 * @param data - Objek jadwal (Schedule) yang akan dibuat.
 * @returns Jadwal yang baru dibuat.
 * @throws Error jika jadwal sudah ada (duplikat).
 */
export async function createSchedule(data: Schedule) {
  try {
    // Cek apakah jadwal dengan field yang sama sudah ada
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        day: data.day,
        start_time: data.start_time,
        Teacher_id: data.Teacher_id,
        Course_id: data.Course_id,
        Period_id: data.Period_id,
      },
    });

    // Jika jadwal sudah ada, lempar error
    if (existingSchedule) {
      throw new Error("Schedule with the same details already exists.");
    }

    // Jika tidak ada duplikat, buat jadwal baru
    const schedule = await prisma.schedule.create({
      data: {
        day: data.day,
        start_time: data.start_time,
        duration: data.duration,
        Teacher_id: data.Teacher_id,
        Course_id: data.Course_id,
        Period_id: data.Period_id, // Menghubungkan dengan periode yang sudah ada
      },
    });

    return schedule;
  } catch (error) {
    console.error("Failed to create schedule:", error);
    throw new Error("Failed to create schedule");
  }
}

/**
 * Mengambil semua jadwal dari database.
 * @returns Array dari objek jadwal (Schedule).
 */
export async function getSchedules(): Promise<Schedule[]> {
  try {
    const schedules = await prisma.schedule.findMany();
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    throw new Error("Failed to fetch schedules");
  }
}

/**
 * Memperbarui jadwal yang sudah ada.
 * @param schedule - Objek jadwal (Schedule) yang akan diperbarui.
 */
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
    throw new Error("Failed to update schedule");
  }
}

/**
 * Menghapus jadwal berdasarkan ID.
 * @param id - ID jadwal yang akan dihapus.
 */
export async function deleteScheduleById(id: number): Promise<void> {
  try {
    await prisma.schedule.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    throw new Error("Failed to delete schedule");
  }
}

/**
 * Mengambil semua jadwal beserta detail guru dan kursus.
 * @returns Array dari objek jadwal (Schedule) dengan detail guru dan kursus.
 */
export async function getSchedulesTeacherCourse(): Promise<Schedule[]> {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        teacher: {
          select: {
            name: true, // Menyertakan nama guru
          },
        },
        course: {
          select: {
            course_name: true, // Menyertakan nama kursus
          },
        },
      },
    });
    return schedules;
  } catch (error) {
    console.error(
      "Failed to fetch schedules with teacher and course details:",
      error
    );
    throw new Error(
      "Failed to fetch schedules with teacher and course details"
    );
  }
}
