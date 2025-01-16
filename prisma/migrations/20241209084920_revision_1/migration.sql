/*
  Warnings:

  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `student_id` on the `student` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `address` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `email` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `phone_number` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - Added the required column `id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `student_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `name` VARCHAR(100) NULL,
    MODIFY `birth_date` DATETIME(3) NULL,
    MODIFY `address` VARCHAR(150) NULL,
    MODIFY `email` VARCHAR(50) NULL,
    MODIFY `phone_number` VARCHAR(20) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `birth_date` DATETIME(3) NULL,
    `address` VARCHAR(150) NULL,
    `phone_number` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(50) NULL,
    `description` VARCHAR(150) NULL,
    `duration` INTEGER NULL,
    `price` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Period` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` INTEGER NULL,
    `start_time` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `Period_id` INTEGER NOT NULL,
    `Teacher_id` INTEGER NOT NULL,
    `Course_id` INTEGER NOT NULL,

    UNIQUE INDEX `Schedule_id_Period_id_Teacher_id_Course_id_key`(`id`, `Period_id`, `Teacher_id`, `Course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudyContract` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Schedule_id` INTEGER NOT NULL,
    `Schedule_Period_id` INTEGER NOT NULL,
    `Schedule_Teacher_id` INTEGER NOT NULL,
    `Schedule_Course_id` INTEGER NOT NULL,
    `Student_id` INTEGER NOT NULL,

    UNIQUE INDEX `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teache_key`(`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `excused` BOOLEAN NULL,
    `present` BOOLEAN NULL,
    `sick` BOOLEAN NULL,
    `alpha` BOOLEAN NULL,
    `StudyContract_Schedule_id` INTEGER NOT NULL,
    `StudyContract_Schedule_Period_id` INTEGER NOT NULL,
    `StudyContract_Schedule_Teacher_id` INTEGER NOT NULL,
    `StudyContract_Schedule_Course_id` INTEGER NOT NULL,
    `StudyContract_Student_id` INTEGER NOT NULL,
    `studentId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `present` BOOLEAN NULL,
    `sick` BOOLEAN NULL,
    `alpha` BOOLEAN NULL,
    `excused` BOOLEAN NULL,
    `Schedule_id` INTEGER NOT NULL,
    `Schedule_Period_id` INTEGER NOT NULL,
    `Schedule_Teacher_id` INTEGER NOT NULL,
    `Schedule_Course_id` INTEGER NOT NULL,
    `teacherId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NULL,
    `due_date` DATETIME(3) NULL,
    `status` ENUM('lunas', 'belum_lunas') NULL,
    `amount` DOUBLE NULL,
    `Student_id` INTEGER NOT NULL,

    UNIQUE INDEX `Invoice_id_Student_id_key`(`id`, `Student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelectedCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Course_id` INTEGER NOT NULL,
    `Invoice_id` INTEGER NOT NULL,
    `Invoice_Student_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Period_id_fkey` FOREIGN KEY (`Period_id`) REFERENCES `Period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Teacher_id_fkey` FOREIGN KEY (`Teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Course_id_fkey` FOREIGN KEY (`Course_id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyContract` ADD CONSTRAINT `StudyContract_Schedule_id_Schedule_Period_id_Schedule_Teach_fkey` FOREIGN KEY (`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`) REFERENCES `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_StudyContract_Schedule_id_StudyContract_S_fkey` FOREIGN KEY (`StudyContract_Schedule_id`, `StudyContract_Schedule_Period_id`, `StudyContract_Schedule_Teacher_id`, `StudyContract_Schedule_Course_id`, `StudyContract_Student_id`) REFERENCES `StudyContract`(`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_Schedule_id_Schedule_Period_id_Schedule_T_fkey` FOREIGN KEY (`Schedule_id`, `Schedule_Period_id`, `Schedule_Teacher_id`, `Schedule_Course_id`) REFERENCES `Schedule`(`id`, `Period_id`, `Teacher_id`, `Course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAttendance` ADD CONSTRAINT `TeacherAttendance_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_Student_id_fkey` FOREIGN KEY (`Student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Course_id_fkey` FOREIGN KEY (`Course_id`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Invoice_id_Invoice_Student_id_fkey` FOREIGN KEY (`Invoice_id`, `Invoice_Student_id`) REFERENCES `Invoice`(`id`, `Student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
