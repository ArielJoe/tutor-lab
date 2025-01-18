/*
  Warnings:

  - You are about to drop the column `Student_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `metode` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `Course_id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `Period_id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `Teacher_id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `Course_id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Invoice_Student_id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Invoice_id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Course_id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Period_id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Teacher_id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Student_id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Course_id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Period_id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Teacher_id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Student_id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Course_id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Period_id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Teacher_id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,studentId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,periodId,teacherId,courseId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,schedulePeriodId,scheduleTeacherId,scheduleCourseId,studentId]` on the table `StudyContract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,schedulePeriodId,scheduleTeacherId,scheduleCourseId,studentId]` on the table `StudyContract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `method` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceStudentId` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_time` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyContractScheduleCourseId` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyContractScheduleId` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyContractSchedulePeriodId` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyContractScheduleTeacherId` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyContractStudentId` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleCourseId` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedulePeriodId` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTeacherId` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_time` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleCourseId` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedulePeriodId` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTeacherId` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Course_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Period_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Course_id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Invoice_id_Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teach_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_Schedule_id_Schedule_Period_id_Schedule_T_fkey`;

-- DropIndex
DROP INDEX `Invoice_id_Student_id_key` ON `invoice`;

-- DropIndex
DROP INDEX `Schedule_id_Period_id_Teacher_id_Course_id_key` ON `schedule`;

-- DropIndex
DROP INDEX `StudyContract_id_Schedule_Period_id_Schedule_Teacher_id_Sche_key` ON `studycontract`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `Student_id`,
    DROP COLUMN `metode`,
    ADD COLUMN `method` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `Course_id`,
    DROP COLUMN `Period_id`,
    DROP COLUMN `Teacher_id`,
    ADD COLUMN `courseId` INTEGER NOT NULL,
    ADD COLUMN `periodId` INTEGER NOT NULL,
    ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `selectedcourse` DROP COLUMN `Course_id`,
    DROP COLUMN `Invoice_Student_id`,
    DROP COLUMN `Invoice_id`,
    ADD COLUMN `courseId` INTEGER NOT NULL,
    ADD COLUMN `invoiceId` INTEGER NOT NULL,
    ADD COLUMN `invoiceStudentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studentattendance` DROP COLUMN `StudyContract_Schedule_Course_id`,
    DROP COLUMN `StudyContract_Schedule_Period_id`,
    DROP COLUMN `StudyContract_Schedule_Teacher_id`,
    DROP COLUMN `StudyContract_Schedule_id`,
    DROP COLUMN `StudyContract_Student_id`,
    ADD COLUMN `date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `studyContractScheduleCourseId` INTEGER NOT NULL,
    ADD COLUMN `studyContractScheduleId` INTEGER NOT NULL,
    ADD COLUMN `studyContractSchedulePeriodId` INTEGER NOT NULL,
    ADD COLUMN `studyContractScheduleTeacherId` INTEGER NOT NULL,
    ADD COLUMN `studyContractStudentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studycontract` DROP COLUMN `Schedule_Course_id`,
    DROP COLUMN `Schedule_Period_id`,
    DROP COLUMN `Schedule_Teacher_id`,
    DROP COLUMN `Schedule_id`,
    DROP COLUMN `Student_id`,
    ADD COLUMN `scheduleCourseId` INTEGER NOT NULL,
    ADD COLUMN `scheduleId` INTEGER NOT NULL,
    ADD COLUMN `schedulePeriodId` INTEGER NOT NULL,
    ADD COLUMN `scheduleTeacherId` INTEGER NOT NULL,
    ADD COLUMN `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacherattendance` DROP COLUMN `Schedule_Course_id`,
    DROP COLUMN `Schedule_Period_id`,
    DROP COLUMN `Schedule_Teacher_id`,
    DROP COLUMN `Schedule_id`,
    ADD COLUMN `date_time` DATETIME(3) NOT NULL,
    ADD COLUMN `scheduleCourseId` INTEGER NOT NULL,
    ADD COLUMN `scheduleId` INTEGER NOT NULL,
    ADD COLUMN `schedulePeriodId` INTEGER NOT NULL,
    ADD COLUMN `scheduleTeacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_id_studentId_key` ON `Invoice`(`id`, `studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `Schedule_id_periodId_teacherId_courseId_key` ON `Schedule`(`id`, `periodId`, `teacherId`, `courseId`);

-- CreateIndex
CREATE UNIQUE INDEX `StudyContract_id_schedulePeriodId_scheduleTeacherId_schedule_key` ON `StudyContract`(`id`, `schedulePeriodId`, `scheduleTeacherId`, `scheduleCourseId`, `studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `StudyContract_scheduleId_schedulePeriodId_scheduleTeacherId__key` ON `StudyContract`(`scheduleId`, `schedulePeriodId`, `scheduleTeacherId`, `scheduleCourseId`, `studentId`);

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `Period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_scheduleId_schedulePeriodId_scheduleTeacherId_fkey` FOREIGN KEY (`scheduleId`, `schedulePeriodId`, `scheduleTeacherId`, `scheduleCourseId`) REFERENCES `Schedule`(`id`, `periodId`, `teacherId`, `courseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_studyContractScheduleId_studyContractSche_fkey` FOREIGN KEY (`studyContractScheduleId`, `studyContractSchedulePeriodId`, `studyContractScheduleTeacherId`, `studyContractScheduleCourseId`, `studyContractStudentId`) REFERENCES `StudyContract`(`scheduleId`, `schedulePeriodId`, `scheduleTeacherId`, `scheduleCourseId`, `studentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_scheduleId_schedulePeriodId_scheduleTeach_fkey` FOREIGN KEY (`scheduleId`, `schedulePeriodId`, `scheduleTeacherId`, `scheduleCourseId`) REFERENCES `Schedule`(`id`, `periodId`, `teacherId`, `courseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_invoiceId_invoiceStudentId_fkey` FOREIGN KEY (`invoiceId`, `invoiceStudentId`) REFERENCES `Invoice`(`id`, `studentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
