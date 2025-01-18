"use server";

import prisma from "@/app/lib/db";

export async function getTeacherIdByEmail(
  email: string
): Promise<number | null> {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { email },
      select: { id: true },
    });

    return teacher ? teacher.id : null;
  } catch (error) {
    console.error("Failed to fetch teacher ID:", error);
    throw new Error("Failed to fetch teacher ID");
  }
}
