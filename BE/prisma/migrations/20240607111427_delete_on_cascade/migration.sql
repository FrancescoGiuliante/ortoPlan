-- DropForeignKey
ALTER TABLE `credential` DROP FOREIGN KEY `Credential_userId_fkey`;

-- DropForeignKey
ALTER TABLE `myorto` DROP FOREIGN KEY `MyOrto_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Credential` ADD CONSTRAINT `Credential_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyOrto` ADD CONSTRAINT `MyOrto_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
