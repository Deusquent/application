-- AlterTable
ALTER TABLE `event` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `vehicleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
