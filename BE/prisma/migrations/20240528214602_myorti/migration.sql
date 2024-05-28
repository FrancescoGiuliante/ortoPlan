-- CreateTable
CREATE TABLE `MyOrto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `citta` VARCHAR(191) NOT NULL,
    `tipoPiantagione` VARCHAR(191) NOT NULL,
    `numeroPiante` INTEGER NOT NULL,
    `dataSemina` DATETIME(3) NOT NULL,
    `sistemazione` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MyOrto` ADD CONSTRAINT `MyOrto_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
