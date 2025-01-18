"use server";

import prisma from "@/app/lib/db";

export async function getLogs() {
  try {
    const logs = await prisma.log.findMany({
      orderBy: {
        changed_at: "desc", // Sort by most recent logs
      },
    });
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}
