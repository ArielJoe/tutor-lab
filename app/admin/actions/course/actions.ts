"use server";

import prisma from "@/app/lib/db";
import { Course } from "@/app/lib/interfaces";

interface AddCourse {
  course_name: string | null;
  description: string | null;
  duration: number | null;
  price: number | null;
}

export async function addCourse(data: AddCourse) {
  const course = await prisma.course.create({
    data: {
      course_name: data.course_name,
      description: data.description,
      duration: data.duration,
      price: data.price,
    },
  });
  return course;
}

export async function getCourseNameById(id: number): Promise<string | null> {
  const course = await prisma.course.findUnique({
    where: { id },
    select: { course_name: true },
  });

  return course?.course_name || null;
}

export async function getCourses(): Promise<Course[]> {
  const courses = await prisma.course.findMany({
    where: {
      course_name: {
        not: null,
      },
      description: {
        not: null,
      },
      duration: {
        not: null,
      },
      price: {
        not: null,
      },
    },
  });

  return courses as Course[];
}

export async function updateCourse(data: any) {
  await prisma.course.update({
    where: { id: data.id },
    data,
  });
}

export async function deleteCourseById(id: number) {
  await prisma.selectedCourse.deleteMany({
    where: {
      Course_id: id,
    },
  });

  await prisma.schedule.deleteMany({
    where: {
      Course_id: id,
    },
  });

  await prisma.course.delete({
    where: {
      id: id,
    },
  });
}
