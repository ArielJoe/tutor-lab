/*
  Warnings:

  - The values [lunas,belum_lunas] on the enum `Invoice_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `day` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `studentattendance` table. All the data in the column will be lost.
  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birth_date` on the `teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,Schedule_Period_id,Schedule_Teacher_id,Schedule_Course_id,Student_id]` on the table `StudyContract` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Invoice_id_Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teach_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_Schedule_id_Schedule_Period_id_Schedule_T_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_teacherId_fkey`;

-- DropIndex
DROP INDEX `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teache_key` ON `studycontract`;

-- AlterTable
ALTER TABLE `course` MODIFY `course_name` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `metode` ENUM('Tunai', 'Transfer') NULL,
    MODIFY `status` ENUM('Lunas', 'Belum_Lunas') NULL,
    MODIFY `Student_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `period` MODIFY `id` INTEGER NOT NULL,
    MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NULL,
    MODIFY `Teacher_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `selectedcourse` ADD COLUMN `studentId` VARCHAR(191) NULL,
    MODIFY `Invoice_Student_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    ADD COLUMN `parents_phone_number` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `phone_number` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `studentattendance` DROP COLUMN `studentId`,
    ADD COLUMN `scheduleId` INTEGER NULL,
    MODIFY `StudyContract_Schedule_Teacher_id` VARCHAR(191) NOT NULL,
    MODIFY `StudyContract_Student_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `studycontract` MODIFY `Schedule_Teacher_id` VARCHAR(191) NOT NULL,
    MODIFY `Student_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` DROP PRIMARY KEY,
    DROP COLUMN `birth_date`,
    ADD COLUMN `email` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `phone_number` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `teacherattendance` MODIFY `Schedule_Teacher_id` VARCHAR(191) NOT NULL,
    MODIFY `teacherId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `StudyContract_id_Schedule_Period_id_Schedule_Teacher_id_Sche_key` ON `StudyContract`(`id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`);

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Teacher_id_fkey` FOREIGN KEY (`Teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teach_fkey` FOREIGN KEY (`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`) REFERENCES `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey` FOREIGN KEY (`StudyContract_Schedule_id`, `StudyContract_Schedule_Period_id`, `StudyContract_Schedule_Teacher_id`, `StudyContract_Schedule_Course_id`, `StudyContract_Student_id`) REFERENCES `StudyContract`(`id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_Schedule_id_Schedule_Period_id_Schedule_T_fkey` FOREIGN KEY (`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`) REFERENCES `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Invoice_id_Invoice_Student_id_fkey` FOREIGN KEY (`Invoice_id`, `Invoice_Student_id`) REFERENCES `Invoice`(`id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
