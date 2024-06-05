-- DropForeignKey
ALTER TABLE `pianificazioni` DROP FOREIGN KEY `Pianificazioni_myOrtoId_fkey`;

-- AddForeignKey
ALTER TABLE `Pianificazioni` ADD CONSTRAINT `Pianificazioni_myOrtoId_fkey` FOREIGN KEY (`myOrtoId`) REFERENCES `MyOrto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
