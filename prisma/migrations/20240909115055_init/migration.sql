/*
  Warnings:

  - Made the column `description` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `watch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `watch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `watch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model` on table `watch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origin` on table `watch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serial_number` on table `watch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_on_hand` on table `watch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `watch` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `model` VARCHAR(191) NOT NULL,
    MODIFY `origin` VARCHAR(191) NOT NULL,
    MODIFY `serial_number` VARCHAR(191) NOT NULL,
    MODIFY `quantity_on_hand` INTEGER NOT NULL;
