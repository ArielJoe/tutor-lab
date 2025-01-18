"use server";

import prisma from "@/app/lib/db";
import { Student } from "@/app/lib/interfaces";

interface AddStudent {
  name: string;
  birth_date: Date;
  address: string;
  email: string;
  phone_number: string;
  parents_phone_number: string;
}

export async function addStudent(data: AddStudent) {
  const students = await prisma.student.create({
    data: {
      name: data.name,
      birth_date: data.birth_date,
      address: data.address,
      email: data.email,
      phone_number: data.phone_number,
      parents_phone_number: data.parents_phone_number,
    },
  });
}

export async function getStudents(): Promise<Student[]> {
  const students = await prisma.student.findMany();
  return students;
}

export async function getStudentsByName(name: string): Promise<Student[]> {
  return await prisma.student.findMany({
    where: {
      name: {
        contains: name,
      },
    },
  });
}

export async function updateStudent(data: Student) {
  await prisma.student.update({
    where: { id: data.id },
    data,
  });
}

export async function deleteStudentById(id: number) {
  await prisma.studentAttendance.deleteMany({
    where: {
      StudyContract_Student_id: id,
    },
  });

  await prisma.studyContract.deleteMany({
    where: {
      Student_id: id,
    },
  });

  await prisma.invoice.deleteMany({
    where: {
      Student_id: id,
    },
  });

  await prisma.student.delete({
    where: {
      id: id,
    },
  });
}
