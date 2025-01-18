/*
  Warnings:

  - You are about to alter the column `start_time` on the `schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `schedule` MODIFY `start_time` DATETIME(3) NOT NULL;
