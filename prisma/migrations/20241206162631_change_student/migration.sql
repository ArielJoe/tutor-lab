/*
  Warnings:

  - Added the required column `email` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;
