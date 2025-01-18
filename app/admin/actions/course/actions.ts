"use server";

import prisma from "@/app/lib/db";
import { Course } from "@/app/lib/interfaces";

interface AddCourse {
  course_name: string;
  description: string;
  duration: number;
  price: number;
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
  const courses = await prisma.course.findMany();

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
}
