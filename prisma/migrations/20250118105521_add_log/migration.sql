-- DropIndex
DROP INDEX `StudyContract_Student_Id_fkey` ON `studycontract`;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_name` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `record_id` INTEGER NOT NULL,
    `change_details` VARCHAR(191) NOT NULL,
    `changed_at` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
