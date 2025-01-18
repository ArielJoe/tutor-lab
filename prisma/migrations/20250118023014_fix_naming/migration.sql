/*
  Warnings:

  - You are about to drop the column `studentId` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `periodId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceStudentId` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `studyContractScheduleCourseId` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `studyContractScheduleId` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `studyContractSchedulePeriodId` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `studyContractScheduleTeacherId` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `studyContractStudentId` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleCourseId` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `schedulePeriodId` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleTeacherId` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleCourseId` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `schedulePeriodId` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleTeacherId` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `teacherattendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,Student_Id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,Period_Id,Teacher_Id,Course_Id]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,Schedule_Period_Id,Schedule_Teacher_Id,Schedule_Course_Id,Student_Id]` on the table `StudyContract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Schedule_Id,Schedule_Period_Id,Schedule_Teacher_Id,Schedule_Course_Id,Student_Id]` on the table `StudyContract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Student_Id` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Course_Id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Period_Id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Teacher_Id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Course_Id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Invoice_Id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Invoice_Student_Id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Student_Id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Study_Contract_Schedule_Course_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Study_Contract_Schedule_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Study_Contract_Schedule_Period_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Study_Contract_Schedule_Teacher_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Study_Contract_Student_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Course_Id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Period_Id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Teacher_Id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Student_Id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Course_Id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Period_Id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Teacher_Id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Teacher_Id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_periodId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_invoiceId_invoiceStudentId_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_studyContractScheduleId_studyContractSche_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_scheduleId_schedulePeriodId_scheduleTeacherId_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_scheduleId_schedulePeriodId_scheduleTeach_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_teacherId_fkey`;

-- DropIndex
DROP INDEX `Invoice_id_studentId_key` ON `invoice`;

-- DropIndex
DROP INDEX `Schedule_id_periodId_teacherId_courseId_key` ON `schedule`;

-- DropIndex
DROP INDEX `StudyContract_id_schedulePeriodId_scheduleTeacherId_schedule_key` ON `studycontract`;

-- DropIndex
DROP INDEX `StudyContract_scheduleId_schedulePeriodId_scheduleTeacherId__key` ON `studycontract`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `studentId`,
    ADD COLUMN `Student_Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `courseId`,
    DROP COLUMN `periodId`,
    DROP COLUMN `teacherId`,
    ADD COLUMN `Course_Id` INTEGER NOT NULL,
    ADD COLUMN `Period_Id` INTEGER NOT NULL,
    ADD COLUMN `Teacher_Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `selectedcourse` DROP COLUMN `courseId`,
    DROP COLUMN `invoiceId`,
    DROP COLUMN `invoiceStudentId`,
    DROP COLUMN `studentId`,
    ADD COLUMN `Course_Id` INTEGER NOT NULL,
    ADD COLUMN `Invoice_Id` INTEGER NOT NULL,
    ADD COLUMN `Invoice_Student_Id` INTEGER NOT NULL,
    ADD COLUMN `Student_Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studentattendance` DROP COLUMN `scheduleId`,
    DROP COLUMN `studyContractScheduleCourseId`,
    DROP COLUMN `studyContractScheduleId`,
    DROP COLUMN `studyContractSchedulePeriodId`,
    DROP COLUMN `studyContractScheduleTeacherId`,
    DROP COLUMN `studyContractStudentId`,
    ADD COLUMN `Schedule_Id` INTEGER NOT NULL,
    ADD COLUMN `Study_Contract_Schedule_Course_Id` INTEGER NOT NULL,
    ADD COLUMN `Study_Contract_Schedule_Id` INTEGER NOT NULL,
    ADD COLUMN `Study_Contract_Schedule_Period_Id` INTEGER NOT NULL,
    ADD COLUMN `Study_Contract_Schedule_Teacher_Id` INTEGER NOT NULL,
    ADD COLUMN `Study_Contract_Student_Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studycontract` DROP COLUMN `scheduleCourseId`,
    DROP COLUMN `scheduleId`,
    DROP COLUMN `schedulePeriodId`,
    DROP COLUMN `scheduleTeacherId`,
    DROP COLUMN `studentId`,
    ADD COLUMN `Schedule_Course_Id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Period_Id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Teacher_Id` INTEGER NOT NULL,
    ADD COLUMN `Student_Id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacherattendance` DROP COLUMN `scheduleCourseId`,
    DROP COLUMN `scheduleId`,
    DROP COLUMN `schedulePeriodId`,
    DROP COLUMN `scheduleTeacherId`,
    DROP COLUMN `teacherId`,
    ADD COLUMN `Schedule_Course_Id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Period_Id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Teacher_Id` INTEGER NOT NULL,
    ADD COLUMN `Teacher_Id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_id_Student_Id_key` ON `Invoice`(`id`, `Student_Id`);

-- CreateIndex
CREATE UNIQUE INDEX `Schedule_id_Period_Id_Teacher_Id_Course_Id_key` ON `Schedule`(`id`, `Period_Id`, `Teacher_Id`, `Course_Id`);

-- CreateIndex
CREATE UNIQUE INDEX `StudyContract_id_Schedule_Period_Id_Schedule_Teacher_Id_Sche_key` ON `StudyContract`(`id`, `Schedule_Period_Id`, `Schedule_Teacher_Id`, `Schedule_Course_Id`, `Student_Id`);

-- CreateIndex
CREATE UNIQUE INDEX `StudyContract_Schedule_Id_Schedule_Period_Id_Schedule_Teache_key` ON `StudyContract`(`Schedule_Id`, `Schedule_Period_Id`, `Schedule_Teacher_Id`, `Schedule_Course_Id`, `Student_Id`);

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Period_Id_fkey` FOREIGN KEY (`Period_Id`) REFERENCES `Period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Teacher_Id_fkey` FOREIGN KEY (`Teacher_Id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Course_Id_fkey` FOREIGN KEY (`Course_Id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Schedule_Id_Schedule_Period_Id_Schedule_Teach_fkey` FOREIGN KEY (`Schedule_Id`, `Schedule_Period_Id`, `Schedule_Teacher_Id`, `Schedule_Course_Id`) REFERENCES `Schedule`(`id`, `Period_Id`, `Teacher_Id`, `Course_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Student_Id_fkey` FOREIGN KEY (`Student_Id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_Study_Contract_Schedule_Id_Study_Contract_fkey` FOREIGN KEY (`Study_Contract_Schedule_Id`, `Study_Contract_Schedule_Period_Id`, `Study_Contract_Schedule_Teacher_Id`, `Study_Contract_Schedule_Course_Id`, `Study_Contract_Student_Id`) REFERENCES `StudyContract`(`Schedule_Id`, `Schedule_Period_Id`, `Schedule_Teacher_Id`, `Schedule_Course_Id`, `Student_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_Schedule_Id_fkey` FOREIGN KEY (`Schedule_Id`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_Schedule_Id_Schedule_Period_Id_Schedule_T_fkey` FOREIGN KEY (`Schedule_Id`, `Schedule_Period_Id`, `Schedule_Teacher_Id`, `Schedule_Course_Id`) REFERENCES `Schedule`(`id`, `Period_Id`, `Teacher_Id`, `Course_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_Teacher_Id_fkey` FOREIGN KEY (`Teacher_Id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_Student_Id_fkey` FOREIGN KEY (`Student_Id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Course_Id_fkey` FOREIGN KEY (`Course_Id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Invoice_Id_Invoice_Student_Id_fkey` FOREIGN KEY (`Invoice_Id`, `Invoice_Student_Id`) REFERENCES `Invoice`(`id`, `Student_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Student_Id_fkey` FOREIGN KEY (`Student_Id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
