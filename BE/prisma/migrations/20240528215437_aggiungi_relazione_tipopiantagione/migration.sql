-- AddForeignKey
ALTER TABLE `MyOrto` ADD CONSTRAINT `MyOrto_tipoPiantagione_fkey` FOREIGN KEY (`tipoPiantagione`) REFERENCES `Ortaggi`(`nome`) ON DELETE RESTRICT ON UPDATE CASCADE;
