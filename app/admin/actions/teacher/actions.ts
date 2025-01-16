"use server";

import prisma from "@/app/lib/db";

interface Teacher {
  id: number;
  name: string | null;
  address: string | null;
  email: string | null;
  phone_number: string | null;
}

interface AddTeacher {
  name: string | null;
  address: string | null;
  email: string | null;
  phone_number: string | null;
}

export async function addTeacher(data: AddTeacher) {
  const teachers = await prisma.teacher.create({
    data: {
      name: data.name,
      address: data.address,
      email: data.email,
      phone_number: data.phone_number,
    },
  });
}

export async function getTeacherNameById(id: number): Promise<string | null> {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    select: { name: true },
  });

  return teacher?.name || null;
}

export async function getTeacher(): Promise<Teacher[]> {
  const teachers = await prisma.teacher.findMany();
  return teachers;
}

export async function getTeachersByName(name: string): Promise<Teacher[]> {
  return await prisma.teacher.findMany({
    where: {
      name: {
        contains: name,
      },
    },
  });
}

export async function updateTeacher(data: Teacher) {
  await prisma.teacher.update({
    where: { id: data.id },
    data,
  });
}

export async function deleteTeacherById(id: number) {
  await prisma.studyContract.deleteMany({
    where: {
      Schedule_Teacher_id: id,
    },
  });

  await prisma.teacher.delete({
    where: {
      id: id,
    },
  });
}
