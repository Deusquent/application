/*
  Warnings:

  - Added the required column `userId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_vehicleId_fkey`;

-- DropIndex
DROP INDEX `Document_vehicleId_fkey` ON `document`;

-- AlterTable
ALTER TABLE `document` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `expiryDate` DATETIME(3) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `vehicleId` INTEGER NULL;

-- AlterTable
ALTER TABLE `event` ADD COLUMN `heure` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
