/*
  Warnings:

  - Added the required column `userId` to the `Notifica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifica` ADD COLUMN `userId` INTEGER NOT NULL;
