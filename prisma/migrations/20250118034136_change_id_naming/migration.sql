/*
  Warnings:

  - You are about to drop the column `Student_Id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `Course_Id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `Period_Id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `Teacher_Id` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `Course_Id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Invoice_Id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Invoice_Student_Id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Student_Id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Course_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Period_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Schedule_Teacher_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `StudyContract_Student_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Course_Id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Period_Id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Teacher_Id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Student_Id` on the `studycontract` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Course_Id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Period_Id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Schedule_Teacher_Id` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Teacher_Id` on the `teacherattendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,Student_id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,Period_id,Teacher_id,Course_id]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Schedule_id,Schedule_Period_id,Schedule_Teacher_id,Schedule_Course_id,Student_id]` on the table `StudyContract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Student_id` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Course_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Period_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Teacher_id` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Course_id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Invoice_Student_id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Invoice_id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Student_id` to the `SelectedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_Course_id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_Period_id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_Teacher_id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Student_id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Course_id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Period_id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Teacher_id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Student_id` to the `StudyContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Course_id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Period_id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_Teacher_id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Schedule_id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Teacher_id` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_Student_Id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Course_Id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Period_Id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Teacher_Id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Course_Id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Invoice_Id_Invoice_Student_Id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Student_Id_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_Schedule_Id_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_StudyContract_Schedule_Id_StudyContract_S_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Schedule_Id_Schedule_Period_Id_Schedule_Teach_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Student_Id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_Schedule_Id_Schedule_Period_Id_Schedule_T_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_Teacher_Id_fkey`;

-- DropIndex
DROP INDEX `Invoice_id_Student_Id_key` ON `invoice`;

-- DropIndex
DROP INDEX `Schedule_id_Period_Id_Teacher_Id_Course_Id_key` ON `schedule`;

-- DropIndex
DROP INDEX `StudyContract_Schedule_Id_Schedule_Period_Id_Schedule_Teache_key` ON `studycontract`;

-- DropIndex
DROP INDEX `StudyContract_id_Schedule_Period_Id_Schedule_Teacher_Id_Sche_key` ON `studycontract`;

-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `Student_Id`,
    ADD COLUMN `Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `Course_Id`,
    DROP COLUMN `Period_Id`,
    DROP COLUMN `Teacher_Id`,
    ADD COLUMN `Course_id` INTEGER NOT NULL,
    ADD COLUMN `Period_id` INTEGER NOT NULL,
    ADD COLUMN `Teacher_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `selectedcourse` DROP COLUMN `Course_Id`,
    DROP COLUMN `Invoice_Id`,
    DROP COLUMN `Invoice_Student_Id`,
    DROP COLUMN `Student_Id`,
    ADD COLUMN `Course_id` INTEGER NOT NULL,
    ADD COLUMN `Invoice_Student_id` INTEGER NOT NULL,
    ADD COLUMN `Invoice_id` INTEGER NOT NULL,
    ADD COLUMN `Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studentattendance` DROP COLUMN `Schedule_Id`,
    DROP COLUMN `StudyContract_Schedule_Course_Id`,
    DROP COLUMN `StudyContract_Schedule_Id`,
    DROP COLUMN `StudyContract_Schedule_Period_Id`,
    DROP COLUMN `StudyContract_Schedule_Teacher_Id`,
    DROP COLUMN `StudyContract_Student_Id`,
    ADD COLUMN `Schedule_id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_Course_id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_Period_id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_Teacher_id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studycontract` DROP COLUMN `Schedule_Course_Id`,
    DROP COLUMN `Schedule_Id`,
    DROP COLUMN `Schedule_Period_Id`,
    DROP COLUMN `Schedule_Teacher_Id`,
    DROP COLUMN `Student_Id`,
    ADD COLUMN `Schedule_Course_id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Period_id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Teacher_id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_id` INTEGER NOT NULL,
    ADD COLUMN `Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacherattendance` DROP COLUMN `Schedule_Course_Id`,
    DROP COLUMN `Schedule_Id`,
    DROP COLUMN `Schedule_Period_Id`,
    DROP COLUMN `Schedule_Teacher_Id`,
    DROP COLUMN `Teacher_Id`,
    ADD COLUMN `Schedule_Course_id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Period_id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_Teacher_id` INTEGER NOT NULL,
    ADD COLUMN `Schedule_id` INTEGER NOT NULL,
    ADD COLUMN `Teacher_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_StudentToStudyContract` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StudentToStudyContract_AB_unique`(`A`, `B`),
    INDEX `_StudentToStudyContract_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_id_Student_id_key` ON `Invoice`(`id`, `Student_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Schedule_id_Period_id_Teacher_id_Course_id_key` ON `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`);

-- CreateIndex
CREATE UNIQUE INDEX `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teache_key` ON `StudyContract`(`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`);

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Period_id_fkey` FOREIGN KEY (`Period_id`) REFERENCES `Period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Teacher_id_fkey` FOREIGN KEY (`Teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Course_id_fkey` FOREIGN KEY (`Course_id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Schedule_id_fkey` FOREIGN KEY (`Schedule_id`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey` FOREIGN KEY (`StudyContract_Schedule_id`, `StudyContract_Schedule_Period_id`, `StudyContract_Schedule_Teacher_id`, `StudyContract_Schedule_Course_id`, `StudyContract_Student_id`) REFERENCES `StudyContract`(`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_Schedule_id_fkey` FOREIGN KEY (`Schedule_id`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_Schedule_id_Schedule_Period_id_Schedule_T_fkey` FOREIGN KEY (`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`) REFERENCES `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_Teacher_id_fkey` FOREIGN KEY (`Teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Course_id_fkey` FOREIGN KEY (`Course_id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Invoice_id_Invoice_Student_id_fkey` FOREIGN KEY (`Invoice_id`, `Invoice_Student_id`) REFERENCES `Invoice`(`id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StudentToStudyContract` ADD CONSTRAINT `_StudentToStudyContract_A_fkey` FOREIGN KEY (`A`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StudentToStudyContract` ADD CONSTRAINT `_StudentToStudyContract_B_fkey` FOREIGN KEY (`B`) REFERENCES `StudyContract`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
