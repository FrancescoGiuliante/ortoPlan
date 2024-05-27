-- CreateTable
CREATE TABLE `Ortaggi` (
    `nome` VARCHAR(191) NOT NULL,
    `periodoColtivazione` VARCHAR(191) NOT NULL,
    `esposizione` VARCHAR(191) NOT NULL,
    `tempiMaturazione` INTEGER NOT NULL,
    `tipoTerreno` VARCHAR(191) NOT NULL,
    `distanzaPiantagione` VARCHAR(191) NOT NULL,
    `profonditaSemina` VARCHAR(191) NOT NULL,
    `temperaturaMin` VARCHAR(191) NOT NULL,
    `temperaturaMax` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`nome`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
