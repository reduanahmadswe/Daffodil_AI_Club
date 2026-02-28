-- AlterTable
ALTER TABLE `user` ADD COLUMN `membershipStatus` ENUM('NONE', 'PENDING', 'ACTIVE', 'REJECTED') NOT NULL DEFAULT 'NONE',
    MODIFY `role` ENUM('VISITOR', 'MEMBER', 'EXECUTIVE', 'ADMIN') NOT NULL DEFAULT 'VISITOR';

-- CreateTable
CREATE TABLE `MembershipApplication` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `paymentMethod` ENUM('BKASH', 'NAGAD', 'ROCKET') NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `phoneNumber` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `rejectionReason` TEXT NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MembershipApplication_userId_idx`(`userId`),
    INDEX `MembershipApplication_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MembershipApplication` ADD CONSTRAINT `MembershipApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
