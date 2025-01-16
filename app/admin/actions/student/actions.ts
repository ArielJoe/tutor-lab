"use server";

import prisma from "@/app/lib/db";

interface Student {
  id: number;
  name: string | null;
  birth_date: Date | null;
  address: string | null;
  email: string | null;
  phone_number: string | null;
  parents_phone_number: string | null;
}

interface AddStudent {
  name: string | null;
  birth_date: Date | null;
  address: string | null;
  email: string | null;
  phone_number: string | null;
  parents_phone_number: string | null;
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

export async function getStudent(): Promise<Student[]> {
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
  await prisma.selectedCourse.deleteMany({
    where: {
      Invoice_Student_id: id,
    },
  });

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
