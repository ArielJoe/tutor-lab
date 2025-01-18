/*
  Warnings:

  - Made the column `status` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metode` on table `invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `day` on table `schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `status` VARCHAR(191) NOT NULL,
    MODIFY `metode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `day` VARCHAR(191) NOT NULL;
