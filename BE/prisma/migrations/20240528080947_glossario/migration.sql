-- CreateTable
CREATE TABLE `Glossario` (
    `parola` VARCHAR(191) NOT NULL,
    `definizione` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`parola`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
