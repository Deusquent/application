/*
  Warnings:

  - Added the required column `garage` to the `Mecano` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siret` to the `Mecano` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mecano` ADD COLUMN `garage` VARCHAR(191) NOT NULL,
    ADD COLUMN `siret` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Entretien` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `km` INTEGER NOT NULL,
    `facture` VARCHAR(191) NULL,
    `vehicleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Entretien` ADD CONSTRAINT `Entretien_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `mecano` RENAME INDEX `mecano_email_key` TO `Mecano_email_key`;
