"use server";

import prisma from "@/app/lib/db";

export async function getStudyContractByStudentId(studentId: string) {
  const studyContracts = await prisma.studyContract.findMany({
    where: { Student_id: parseInt(studentId) },
    include: {
      schedule: {
        include: {
          teacher: true,
          course: true,
        },
      },
    },
  });

  return studyContracts;
}

export async function createStudyContract(data: {
  Schedule_id: number;
  Schedule_Period_id: number;
  Schedule_Teacher_id: number;
  Schedule_Course_id: number;
  Student_id: number;
}) {
  return await prisma.studyContract.create({
    data,
  });
}
