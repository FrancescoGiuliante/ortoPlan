/*
  Warnings:

  - The primary key for the `credential` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creID` on the `credential` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `credential` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `credential` DROP FOREIGN KEY `Credential_creID_fkey`;

-- AlterTable
ALTER TABLE `credential` DROP PRIMARY KEY,
    DROP COLUMN `creID`,
    DROP COLUMN `id`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- AddForeignKey
ALTER TABLE `Credential` ADD CONSTRAINT `Credential_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
