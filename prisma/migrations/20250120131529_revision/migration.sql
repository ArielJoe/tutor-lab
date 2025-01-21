/*
  Warnings:

  - You are about to drop the column `Invoice_Student_id` on the `selectedcourse` table. All the data in the column will be lost.
  - You are about to drop the column `Student_id` on the `selectedcourse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Invoice_id_Invoice_Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `selectedcourse` DROP FOREIGN KEY `SelectedCourse_Student_id_fkey`;

-- AlterTable
ALTER TABLE `selectedcourse` DROP COLUMN `Invoice_Student_id`,
    DROP COLUMN `Student_id`;

-- AddForeignKey
ALTER TABLE `SelectedCourse` ADD CONSTRAINT `SelectedCourse_Invoice_id_fkey` FOREIGN KEY (`Invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
