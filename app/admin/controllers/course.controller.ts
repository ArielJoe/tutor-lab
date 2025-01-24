"use server";

import prisma from "@/app/lib/db";
import { Course } from "@/app/lib/interfaces";

interface AddCourse {
  course_name: string;
  description: string;
  duration: number;
  price: number;
}

/**
 * Menambahkan kursus baru ke database.
 * @param data - Objek yang berisi detail kursus (nama, deskripsi, durasi, harga).
 * @returns Objek kursus yang baru dibuat.
 */
export async function addCourse(data: AddCourse) {
  try {
    // Check if the course name already exists (case-insensitive)
    const existingCourse = await prisma.course.findFirst({
      where: {
        course_name: {
          equals: data.course_name,
        },
      },
    });

    if (existingCourse) {
      throw new Error("Course name already exists");
    }

    // If the course name doesn't exist, create the course
    const course = await prisma.course.create({
      data: {
        course_name: data.course_name,
        description: data.description,
        duration: data.duration,
        price: data.price,
      },
    });

    return course;
  } catch (error) {
    console.error("Failed to add course:", error);
    throw error; // Throw the error to be handled by the frontend
  }
}

/**
 * Mengambil nama kursus berdasarkan ID-nya.
 * @param id - ID kursus yang akan dicari.
 * @returns Nama kursus sebagai string, atau null jika kursus tidak ditemukan.
 */
export async function getCourseNameById(id: number): Promise<string | null> {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      select: { course_name: true },
    });
    return course?.course_name || null;
  } catch (error) {
    console.error("Failed to fetch course name:", error);
    throw new Error("Failed to fetch course name");
  }
}

/**
 * Mengambil semua kursus dari database.
 * @returns Array dari objek kursus.
 */
export async function getCourses(): Promise<Course[]> {
  try {
    const courses = await prisma.course.findMany();
    return courses as Course[];
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

/**
 * Memperbarui kursus yang sudah ada di database.
 * @param data - Objek yang berisi ID kursus dan field yang akan diperbarui.
 */
export async function updateCourse(data: any) {
  try {
    await prisma.course.update({
      where: { id: data.id },
      data,
    });
  } catch (error) {
    console.error("Failed to update course:", error);
    throw new Error("Failed to update course");
  }
}

/**
 * Menghapus kursus dan catatan terkait (selectedCourse dan schedule) berdasarkan ID-nya.
 * @param id - ID kursus yang akan dihapus.
 */
export async function deleteCourseById(id: number) {
  try {
    await prisma.selectedCourse.deleteMany({
      where: {
        id: id,
      },
    });
    await prisma.schedule.deleteMany({
      where: {
        id: id,
      },
    });
    await prisma.course.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Failed to delete course:", error);
    throw new Error("Failed to delete course");
  }
}
