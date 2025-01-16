/*
  Warnings:

  - You are about to alter the column `Student_id` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `Teacher_id` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `Invoice_Student_id` on the `selectedcourse` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `studentId` on the `selectedcourse` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `StudyContract_Schedule_Teacher_id` on the `studentattendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `StudyContract_Student_id` on the `studentattendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `Schedule_Teacher_id` on the `studycontract` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `Student_id` on the `studycontract` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `teacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `Schedule_Teacher_id` on the `teacherattendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `teacherId` on the `teacherattendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_Teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Invoice_id_Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teach_fkey`;

-- DropForeignKey
ALTER TABLE `studycontract` DROP FOREIGN KEY `StudyContract_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_Schedule_id_Schedule_Period_id_Schedule_T_fkey`;

-- DropForeignKey
ALTER TABLE `teacherattendance` DROP FOREIGN KEY `TeacherAttendance_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleId_fkey`;

-- AlterTable
ALTER TABLE `invoice` MODIFY `Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `period` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `schedule` MODIFY `Teacher_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `selectedcourse` MODIFY `Invoice_Student_id` INTEGER NOT NULL,
    MODIFY `studentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `studentattendance` MODIFY `StudyContract_Schedule_Teacher_id` INTEGER NOT NULL,
    MODIFY `StudyContract_Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `studycontract` MODIFY `Schedule_Teacher_id` INTEGER NOT NULL,
    MODIFY `Student_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacher` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `teacherattendance` MODIFY `Schedule_Teacher_id` INTEGER NOT NULL,
    MODIFY `teacherId` INTEGER NULL;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Teacher_id_fkey` FOREIGN KEY (`Teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teach_fkey` FOREIGN KEY (`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`) REFERENCES `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey` FOREIGN KEY (`StudyContract_Schedule_id`, `StudyContract_Schedule_Period_id`, `StudyContract_Schedule_Teacher_id`, `StudyContract_Schedule_Course_id`, `StudyContract_Student_id`) REFERENCES `StudyContract`(`id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
