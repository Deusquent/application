/*
  Warnings:

  - Added the required column `imatriculation` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `imatriculation` VARCHAR(191) NOT NULL;
