/*
  Warnings:

  - You are about to drop the column `alpha` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `excused` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `sick` on the `studentattendance` table. All the data in the column will be lost.
  - You are about to drop the column `alpha` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `excused` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `teacherattendance` table. All the data in the column will be lost.
  - You are about to drop the column `sick` on the `teacherattendance` table. All the data in the column will be lost.
  - Added the required column `status` to the `StudentAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `TeacherAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `studentattendance` DROP COLUMN `alpha`,
    DROP COLUMN `excused`,
    DROP COLUMN `present`,
    DROP COLUMN `sick`,
    ADD COLUMN `status` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacherattendance` DROP COLUMN `alpha`,
    DROP COLUMN `excused`,
    DROP COLUMN `present`,
    DROP COLUMN `sick`,
    ADD COLUMN `Status` INTEGER NOT NULL;
