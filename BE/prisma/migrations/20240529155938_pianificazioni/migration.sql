-- CreateTable
CREATE TABLE `Pianificazioni` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` VARCHAR(10) NOT NULL,
    `attivita` VARCHAR(191) NOT NULL,
    `completata` BOOLEAN NOT NULL,
    `myOrtoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pianificazioni` ADD CONSTRAINT `Pianificazioni_myOrtoId_fkey` FOREIGN KEY (`myOrtoId`) REFERENCES `MyOrto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
