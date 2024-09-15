/*
  Warnings:

  - You are about to drop the column `quantity_on_hand` on the `watch` table. All the data in the column will be lost.
  - You are about to drop the column `serial_number` on the `watch` table. All the data in the column will be lost.
  - Added the required column `quantityOnHand` to the `Watch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Watch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `watch` DROP COLUMN `quantity_on_hand`,
    DROP COLUMN `serial_number`,
    ADD COLUMN `quantityOnHand` INTEGER NOT NULL,
    ADD COLUMN `serialNumber` VARCHAR(191) NOT NULL;
