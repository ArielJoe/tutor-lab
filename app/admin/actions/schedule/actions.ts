"use server";

import prisma from "@/app/lib/db";

export async function createSchedule(data: any) {
  const schedule = await prisma.schedule.create({
    data,
  });
  return schedule;
}

export async function getSchedule() {
  const schedules = await prisma.schedule.findMany();
  return schedules;
}
