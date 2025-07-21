/*
  Warnings:

  - You are about to alter the column `type` on the `vehicle` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `vehicle` MODIFY `type` ENUM('Berline', 'SUV', 'Citadine', 'Break', 'Coupé', 'Cabriolet', 'Monospace', 'Utilitaire', 'Pick_up', 'Autre') NOT NULL;
