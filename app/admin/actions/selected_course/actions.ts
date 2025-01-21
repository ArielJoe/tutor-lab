"use server";

import prisma from "@/app/lib/db";

export const addSelectedCourse = async (
  course_id: number,
  invoice_id: number
) => {
  try {
    const selectedCourse = await prisma.selectedCourse.create({
      data: {
        Course_id: course_id,
        Invoice_id: invoice_id,
      },
    });
    return selectedCourse;
  } catch (error) {
    console.error("Failed to add selected course:", error);
    throw error;
  }
};
