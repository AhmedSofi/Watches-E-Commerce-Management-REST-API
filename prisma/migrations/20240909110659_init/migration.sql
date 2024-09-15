-- CreateTable
CREATE TABLE `Watch` (
    `id` INTEGER NOT NULL,
    `price` DOUBLE NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `model` VARCHAR(191) NULL,
    `origin` VARCHAR(191) NULL,
    `serial_number` VARCHAR(191) NULL,
    `quantity_on_hand` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToWatch` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToWatch_AB_unique`(`A`, `B`),
    INDEX `_CategoryToWatch_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoryToWatch` ADD CONSTRAINT `_CategoryToWatch_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToWatch` ADD CONSTRAINT `_CategoryToWatch_B_fkey` FOREIGN KEY (`B`) REFERENCES `Watch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
