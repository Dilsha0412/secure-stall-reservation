-- ============================================================
-- Secure Stall Reservation Platform - Database Creation Script
-- Database: bookfair_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS `bookfair_db` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `bookfair_db`;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_token`;
DROP TABLE IF EXISTS `genres`;
DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `stalls`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `business_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) DEFAULT '',
  `user_type` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: stalls
-- ------------------------------------------------------------
CREATE TABLE `stalls` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `stall_code` VARCHAR(50) NOT NULL UNIQUE,
  `size` VARCHAR(50) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `price` DOUBLE NOT NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `row_position` INT NOT NULL,
  `column_position` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: reservations
-- ------------------------------------------------------------
CREATE TABLE `reservations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `event_name` VARCHAR(255) NOT NULL,
  `reservation_date` DATE NOT NULL,
  `stall_type` VARCHAR(100) NOT NULL,
  `preferred_stall_size` VARCHAR(50) NOT NULL,
  `number_of_stalls` INT NOT NULL,
  `business_category` VARCHAR(100) NOT NULL,
  `special_requirements` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `stall_id` BIGINT DEFAULT NULL,
  `qr_code` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `confirmation_email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reservations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reservations_stall` FOREIGN KEY (`stall_id`) REFERENCES `stalls` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: genres
-- ------------------------------------------------------------
CREATE TABLE `genres` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `genre_name` VARCHAR(255) NOT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_genres_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: password_reset_token
-- ------------------------------------------------------------
CREATE TABLE `password_reset_token` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `user_id` BIGINT NOT NULL,
  `expiry_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Initial Data Seeding
-- ============================================================

-- Insert Default Exhibition Organizer Accounts (Password: organizer123 & employee123)
-- BCrypt Hashed Passwords
INSERT INTO `users` (`username`, `email`, `password`, `business_name`, `contact_person`, `phone`, `address`, `user_type`) VALUES
('organizer', 'organizer@bookfair.lk', '$2a$10$E27Vz.N/hRerUvW2hQ0/uejV8g9p1sC9sUu8zE8cR9Wv1xN5E5K4i', 'Exhibition Organizing Authority', 'Exhibition Organizer', '+94 11 2345678', 'Colombo, Sri Lanka', 'ORGANIZER'),
('employee', 'employee@bookfair.lk', '$2a$10$E27Vz.N/hRerUvW2hQ0/uejV8g9p1sC9sUu8zE8cR9Wv1xN5E5K4i', 'Book Fair Organizers', 'Admin Employee', '+94 11 2345678', 'Colombo, Sri Lanka', 'EMPLOYEE');

-- Insert Initial Exhibition Venue Stalls
INSERT INTO `stalls` (`stall_code`, `size`, `location`, `price`, `is_available`, `row_position`, `column_position`) VALUES
('A-101', 'SMALL', 'Hall A - Front Left', 25000, 1, 0, 0),
('A-102', 'SMALL', 'Hall A - Front Center', 25000, 1, 0, 1),
('A-103', 'MEDIUM', 'Hall A - Front Right', 45000, 1, 0, 2),
('A-104', 'LARGE', 'Hall A - Main Display', 75000, 1, 0, 3),
('B-201', 'SMALL', 'Hall B - Entrance', 25000, 1, 1, 0),
('B-202', 'MEDIUM', 'Hall B - Center Walkway', 45000, 1, 1, 1),
('B-203', 'LARGE', 'Hall B - Corner Premium', 75000, 1, 1, 2),
('B-204', 'MEDIUM', 'Hall B - Food Court Side', 45000, 1, 1, 3),
('C-301', 'SMALL', 'Hall C - Tech Zone', 25000, 1, 2, 0),
('C-302', 'MEDIUM', 'Hall C - General Stalls', 45000, 1, 2, 1),
('C-303', 'LARGE', 'Hall C - Premium Exhibit', 75000, 1, 2, 2);
