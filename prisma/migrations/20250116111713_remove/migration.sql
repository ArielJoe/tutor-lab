/*
  Warnings:

  - Made the column `course_name` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `due_date` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `period` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `period` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_date` on table `period` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `schedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `selectedcourse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_date` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parents_phone_number` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `excused` on table `studentattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `present` on table `studentattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sick` on table `studentattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `alpha` on table `studentattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scheduleId` on table `studentattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `teacher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `teacher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `teacher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `teacher` required. This step will fail if there are existing NULL values in that column.
  - Made the column `present` on table `teacherattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sick` on table `teacherattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `alpha` on table `teacherattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `excused` on table `teacherattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teacherId` on table `teacherattendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_teacherId_fkey`;

-- AlterTable
ALTER TABLE `course` MODIFY `course_name` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `duration` INTEGER NOT NULL,
    MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `invoice` MODIFY `created_at` DATETIME(3) NOT NULL,
    MODIFY `due_date` DATETIME(3) NOT NULL,
    MODIFY `amount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `period` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `start_date` DATETIME(3) NOT NULL,
    MODIFY `end_date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `start_time` VARCHAR(191) NOT NULL,
    MODIFY `duration` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `selectedcourse` MODIFY `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `birth_date` DATETIME(3) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `phone_number` VARCHAR(191) NOT NULL,
    MODIFY `parents_phone_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `studentattendance` MODIFY `excused` BOOLEAN NOT NULL,
    MODIFY `present` BOOLEAN NOT NULL,
    MODIFY `sick` BOOLEAN NOT NULL,
    MODIFY `alpha` BOOLEAN NOT NULL,
    MODIFY `scheduleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `phone_number` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teacherattendance` MODIFY `present` BOOLEAN NOT NULL,
    MODIFY `sick` BOOLEAN NOT NULL,
    MODIFY `alpha` BOOLEAN NOT NULL,
    MODIFY `excused` BOOLEAN NOT NULL,
    MODIFY `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
