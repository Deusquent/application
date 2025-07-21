/*
  Warnings:

  - You are about to drop the column `content` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `document` table. All the data in the column will be lost.
  - Added the required column `name` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` DROP COLUMN `content`,
    DROP COLUMN `title`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `path` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `vehicleId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
