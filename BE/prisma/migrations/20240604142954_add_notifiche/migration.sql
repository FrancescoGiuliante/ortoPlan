-- CreateTable
CREATE TABLE `Notifica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pianificazioneId` INTEGER NOT NULL,
    `messaggio` VARCHAR(191) NOT NULL,
    `dataNotifica` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `visualizzata` BOOLEAN NOT NULL DEFAULT false,
    `myOrtoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notifica` ADD CONSTRAINT `Notifica_pianificazioneId_fkey` FOREIGN KEY (`pianificazioneId`) REFERENCES `Pianificazioni`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifica` ADD CONSTRAINT `Notifica_myOrtoId_fkey` FOREIGN KEY (`myOrtoId`) REFERENCES `MyOrto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
