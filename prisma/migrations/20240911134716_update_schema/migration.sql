-- CreateTable
CREATE TABLE `WatchOrder` (
    `id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `WatchordershipmentID` INTEGER NOT NULL,
    `customerRef` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Watchline` (
    `id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderQuantity` INTEGER NOT NULL,
    `quantityallocated` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `WatchId` INTEGER NOT NULL,
    `WatchOrderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WatchOrder` ADD CONSTRAINT `WatchOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WatchOrder` ADD CONSTRAINT `WatchOrder_WatchordershipmentID_fkey` FOREIGN KEY (`WatchordershipmentID`) REFERENCES `Watchordershipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Watchline` ADD CONSTRAINT `Watchline_WatchId_fkey` FOREIGN KEY (`WatchId`) REFERENCES `Watch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Watchline` ADD CONSTRAINT `Watchline_WatchOrderId_fkey` FOREIGN KEY (`WatchOrderId`) REFERENCES `WatchOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
