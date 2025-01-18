"use server";

import prisma from "@/app/lib/db";

export async function getStudyContractByStudentId(studentId: number) {
  const studyContracts = await prisma.studyContract.findMany({
    where: { Student_id: studentId },
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

export async function deleteStudyContract(contractId: number) {
  return await prisma.studyContract.delete({
    where: { id: contractId },
  });
}

export async function createStudyContract(data: {
  scheduleId: number;
  schedulePeriodId: number;
  scheduleTeacherId: number;
  scheduleCourseId: number;
  studentId: number;
}) {
  return await prisma.studyContract.create({
    data: {
      Schedule_id: data.scheduleId,
      Schedule_Period_id: data.schedulePeriodId,
      Schedule_Teacher_id: data.scheduleTeacherId,
      Schedule_Course_id: data.scheduleCourseId,
      Student_id: data.studentId,
    },
  });
}

export async function test() {
  const data = await prisma.$queryRaw`SELECT * FROM Student`;
  return data;
}
