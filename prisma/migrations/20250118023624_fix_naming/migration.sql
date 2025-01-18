/*
  Warnings:

  - You are about to drop the column `Study_Contract_Schedule_Course_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Study_Contract_Schedule_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Study_Contract_Schedule_Period_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Study_Contract_Schedule_Teacher_Id` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `Study_Contract_Student_Id` on the `studentattendance` table. All the data in the column will be lost.
  - Added the required column `StudyContract_Schedule_Course_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_Period_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Schedule_Teacher_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudyContract_Student_Id` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `studentattendance` DROP FOREIGN KEY `StudentAttendance_Study_Contract_Schedule_Id_Study_Contract_fkey`;

-- AlterTable
ALTER TABLE `studentattendance` DROP COLUMN `Study_Contract_Schedule_Course_Id`,
    DROP COLUMN `Study_Contract_Schedule_Id`,
    DROP COLUMN `Study_Contract_Schedule_Period_Id`,
    DROP COLUMN `Study_Contract_Schedule_Teacher_Id`,
    DROP COLUMN `Study_Contract_Student_Id`,
    ADD COLUMN `StudyContract_Schedule_Course_Id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_Id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_Period_Id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Schedule_Teacher_Id` INTEGER NOT NULL,
    ADD COLUMN `StudyContract_Student_Id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `StudentAttendance` ADD CONSTRAINT `StudentAttendance_StudyContract_Schedule_Id_StudyContract_S_fkey` FOREIGN KEY (`StudyContract_Schedule_Id`, `StudyContract_Schedule_Period_Id`, `StudyContract_Schedule_Teacher_Id`, `StudyContract_Schedule_Course_Id`, `StudyContract_Student_Id`) REFERENCES `StudyContract`(`Schedule_Id`, `Schedule_Period_Id`, `Schedule_Teacher_Id`, `Schedule_Course_Id`, `Student_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
