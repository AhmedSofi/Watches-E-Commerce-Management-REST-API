/*
  Warnings:

  - You are about to drop the `watchorder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `watchorder` DROP FOREIGN KEY `WatchOrder_customerId_fkey`;

-- DropTable
DROP TABLE `watchorder`;
