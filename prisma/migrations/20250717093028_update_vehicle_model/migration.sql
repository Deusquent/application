/*
  Warnings:

  - You are about to alter the column `type` on the `vehicle` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `vehicle` MODIFY `type` VARCHAR(191) NOT NULL;
