/*
  Warnings:

  - Added the required column `frequenzaInnaffiatura` to the `Ortaggi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ortaggi` ADD COLUMN `frequenzaInnaffiatura` INTEGER NOT NULL;
