-- CreateTable
CREATE TABLE `Watchordershipment` (
    `id` INTEGER NOT NULL,
    `trackingNumber` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
