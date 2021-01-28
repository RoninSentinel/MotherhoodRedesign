-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2020 at 05:00 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `motherhood`
--

-- --------------------------------------------------------

--
-- Table structure for table `aors`
--

CREATE TABLE `aors` (
  `name` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `aors`
--

INSERT INTO `aors` (`name`, `creation_date`, `last_update`) VALUES
('AOR1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('AOR2', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('AOR3', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('AOR4', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `block_categories`
--

CREATE TABLE `block_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `short_name` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `squadron_id` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `block_categories`
--

INSERT INTO `block_categories` (`id`, `name`, `short_name`, `color`, `is_active`, `squadron_id`, `creation_date`, `last_update`) VALUES
(1, 'presets', 'presets', '#009AFF', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(2, 'transit', 'trnst', '#7FC76D', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(3, 'target', 'tgt', '#AAAFB8', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(4, 'training', 'trng', '#FF4E91', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(5, 'down', 'down', '#000000', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(6, 'maintenance', 'mx', '#FF0000', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `crew_members`
--

CREATE TABLE `crew_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rank` varchar(191) DEFAULT NULL,
  `last_name` varchar(191) NOT NULL,
  `first_name` varchar(191) DEFAULT NULL,
  `middle_initial` varchar(191) DEFAULT NULL,
  `call_sign` varchar(191) DEFAULT NULL,
  `squadron_id` varchar(191) NOT NULL,
  `flight_id` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `crew_members`
--

INSERT INTO `crew_members` (`id`, `rank`, `last_name`, `first_name`, `middle_initial`, `call_sign`, `squadron_id`, `flight_id`, `creation_date`, `last_update`) VALUES
(1, 'Capt', 'Paetz', 'Joseph', 'R', 'Fox', 'Squadron 1', 'A', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `crew_member_shift_line_time_blocks`
--

CREATE TABLE `crew_member_shift_line_time_blocks` (
  `crew_member_id` bigint(20) UNSIGNED NOT NULL,
  `shift_line_time_block_id` bigint(20) UNSIGNED NOT NULL,
  `position` int(11) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `crew_member_shift_line_time_blocks`
--

INSERT INTO `crew_member_shift_line_time_blocks` (`crew_member_id`, `shift_line_time_block_id`, `position`, `creation_date`, `last_update`) VALUES
(1, 1, 1, '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `crew_member_types`
--

CREATE TABLE `crew_member_types` (
  `name` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `crew_member_types`
--

INSERT INTO `crew_member_types` (`name`, `creation_date`, `last_update`) VALUES
('pilot', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('sensor operator', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `flights`
--

CREATE TABLE `flights` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `team_id` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flights`
--

INSERT INTO `flights` (`id`, `name`, `team_id`, `creation_date`, `last_update`) VALUES
(1, 'A', 'Red', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(2, 'B', 'Red', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `flight_orders`
--

CREATE TABLE `flight_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `crew_member_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `shift_template_instance_id` bigint(20) UNSIGNED NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flight_orders`
--

INSERT INTO `flight_orders` (`id`, `crew_member_id`, `date`, `shift_template_instance_id`, `creation_date`, `last_update`) VALUES
(1, 1, '2020-10-15', 1, '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `line_instances`
--

CREATE TABLE `line_instances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `line_template_id` bigint(20) UNSIGNED NOT NULL,
  `shift_template_instance_id` bigint(20) UNSIGNED NOT NULL,
  `color` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `line_instances`
--

INSERT INTO `line_instances` (`id`, `line_template_id`, `shift_template_instance_id`, `color`, `creation_date`, `last_update`) VALUES
(1, 1, 1, '#FF0000', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(2, 2, 1, '#C1CBC4', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(3, 3, 1, '#0000FF', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(4, 4, 1, '#000000', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(5, 5, 1, '#FFF600', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(6, 6, 1, '#FF4E91', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(7, 7, 1, '#000000', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `line_templates`
--

CREATE TABLE `line_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `line_type_id` varchar(191) DEFAULT NULL,
  `color` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `order_preference` int(11) NOT NULL DEFAULT 732,
  `call_sign` varchar(191) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 1,
  `squadron_id` varchar(191) NOT NULL,
  `aor_id` varchar(191) NOT NULL,
  `is_hidden_in_read_mode` tinyint(1) NOT NULL DEFAULT 0,
  `extra_field_name` varchar(191) NOT NULL DEFAULT 'IP/ISO',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `line_templates`
--

INSERT INTO `line_templates` (`id`, `name`, `line_type_id`, `color`, `is_active`, `order_preference`, `call_sign`, `is_default`, `squadron_id`, `aor_id`, `is_hidden_in_read_mode`, `extra_field_name`, `creation_date`, `last_update`) VALUES
(1, 'GCS1', 'MQ-9', '#FF0000', 1, 1, 'CN1', 1, 'Squadron 1', 'AOR3', 0, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(2, 'GCS2', 'MQ-9', '#C1CBC4', 1, 2, 'CN2', 1, 'Squadron 1', 'AOR3', 0, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(3, 'GCS3', 'MQ-9', '#0000FF', 1, 3, 'CN3', 1, 'Squadron 1', 'AOR3', 0, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(4, 'GCS4', 'MQ-9', '#000000', 1, 4, 'CN4', 1, 'Squadron 1', 'AOR3', 0, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(5, 'GCS5', 'MQ-9', '#FFF600', 1, 5, 'CN5', 1, 'Squadron 1', 'AOR3', 0, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(6, 'GCS6', 'MQ-9', '#FF4E91', 1, 6, 'CN6', 1, 'Squadron 1', 'AOR3', 0, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(7, 'MCCs', NULL, '#000000', 1, 7, 'MCC', 1, 'Squadron 1', 'AOR3', 1, 'IP/ISO', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `line_types`
--

CREATE TABLE `line_types` (
  `name` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `line_types`
--

INSERT INTO `line_types` (`name`, `creation_date`, `last_update`) VALUES
('MQ-9', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('MQ-9X', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('MQ-9XX', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2020_09_12_192022_create_squadrons_table', 1),
(2, '2020_09_12_192119_create_aors_table', 1),
(3, '2020_09_14_032048_create_line_instances_table', 2),
(4, '2020_09_14_031732_create_line_types_table', 3),
(5, '2020_09_14_031818_create_crew_member_types_table', 4),
(6, '2020_09_14_032008_create_line_templates_table', 5),
(7, '2020_09_14_031839_create_qualification_types_table', 6),
(8, '2020_09_14_032724_create_shift_template_instances_table', 7),
(9, '2020_09_14_031917_create_qualifications_table', 8),
(10, '2020_09_14_031707_create_shift_templates_table', 9),
(11, '2020_09_24_162526_create_flight_orders_table', 10),
(12, '2020_09_14_031944_create_block_categories_table', 11),
(13, '2020_09_14_032125_create_shift_line_time_blocks_table', 12),
(14, '2020_09_17_000843_create_crew_member_shift_line_time_blocks_table', 13),
(15, '2020_10_06_160226_create_teams_table', 14);

-- --------------------------------------------------------

--
-- Table structure for table `qualifications`
--

CREATE TABLE `qualifications` (
  `crew_member_id` bigint(20) UNSIGNED NOT NULL,
  `qualification_type_id` bigint(20) UNSIGNED NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qualifications`
--

INSERT INTO `qualifications` (`crew_member_id`, `qualification_type_id`, `creation_date`, `last_update`) VALUES
(1, 2, '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `qualification_types`
--

CREATE TABLE `qualification_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `crew_member_type_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qualification_types`
--

INSERT INTO `qualification_types` (`id`, `crew_member_type_id`, `name`, `creation_date`, `last_update`) VALUES
(1, 'pilot', 'MQT', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(2, 'pilot', 'FLUG', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(3, 'pilot', 'MCC', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(4, 'pilot', 'IP', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(5, 'pilot', 'DI', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(6, 'pilot', 'Evaluator', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(7, 'sensor operator', 'ASC', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `shift_line_time_blocks`
--

CREATE TABLE `shift_line_time_blocks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `line_instance_id` bigint(20) UNSIGNED NOT NULL,
  `block_category_id` bigint(20) UNSIGNED NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `position` int(11) NOT NULL,
  `mission_number` int(11) DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shift_line_time_blocks`
--

INSERT INTO `shift_line_time_blocks` (`id`, `line_instance_id`, `block_category_id`, `start_time`, `end_time`, `notes`, `position`, `mission_number`, `creation_date`, `last_update`) VALUES
(1, 1, 1, '2020-10-15 07:30:00', '2020-10-15 08:00:00', NULL, 1, 1234, '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `shift_templates`
--

CREATE TABLE `shift_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `total_hours` decimal(8,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `squadron_id` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shift_templates`
--

INSERT INTO `shift_templates` (`id`, `name`, `start_time`, `end_time`, `total_hours`, `is_active`, `squadron_id`, `creation_date`, `last_update`) VALUES
(1, 'Days', '07:30:00', '16:00:00', '8.50', 1, 'Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `shift_template_instances`
--

CREATE TABLE `shift_template_instances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `shift_template_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shift_template_instances`
--

INSERT INTO `shift_template_instances` (`id`, `shift_template_id`, `date`, `creation_date`, `last_update`) VALUES
(1, 1, '2020-10-15', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `squadrons`
--

CREATE TABLE `squadrons` (
  `name` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `squadrons`
--

INSERT INTO `squadrons` (`name`, `creation_date`, `last_update`) VALUES
('Other', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('Squadron 1', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('Squadron 2', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('Squadron 3', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('Squadron 4', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
('Squadron 5', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `squadron_id` varchar(191) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_update` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `squadron_id`, `creation_date`, `last_update`) VALUES
(1, 'Red', 'Other', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(2, 'White', 'Other', '2020-10-15 03:52:08', '2020-10-15 03:52:08'),
(3, 'Blue', 'Other', '2020-10-15 03:52:08', '2020-10-15 03:52:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aors`
--
ALTER TABLE `aors`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `block_categories`
--
ALTER TABLE `block_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block_categories_squadron_id_foreign` (`squadron_id`);

--
-- Indexes for table `crew_members`
--
ALTER TABLE `crew_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crew_members_squadron_id_foreign` (`squadron_id`);

--
-- Indexes for table `crew_member_shift_line_time_blocks`
--
ALTER TABLE `crew_member_shift_line_time_blocks`
  ADD PRIMARY KEY (`crew_member_id`,`shift_line_time_block_id`),
  ADD KEY `time_block_id_foreign` (`shift_line_time_block_id`);

--
-- Indexes for table `crew_member_types`
--
ALTER TABLE `crew_member_types`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `flights`
--
ALTER TABLE `flights`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flight_orders`
--
ALTER TABLE `flight_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `line_instances`
--
ALTER TABLE `line_instances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `line_templates`
--
ALTER TABLE `line_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `line_templates_line_type_id_foreign` (`line_type_id`),
  ADD KEY `line_templates_squadron_id_foreign` (`squadron_id`),
  ADD KEY `line_templates_aor_id_foreign` (`aor_id`);

--
-- Indexes for table `line_types`
--
ALTER TABLE `line_types`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `qualifications`
--
ALTER TABLE `qualifications`
  ADD PRIMARY KEY (`crew_member_id`,`qualification_type_id`);

--
-- Indexes for table `qualification_types`
--
ALTER TABLE `qualification_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `qualification_types_crew_member_type_id_foreign` (`crew_member_type_id`);

--
-- Indexes for table `shift_line_time_blocks`
--
ALTER TABLE `shift_line_time_blocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shift_templates`
--
ALTER TABLE `shift_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shift_templates_squadron_id_foreign` (`squadron_id`);

--
-- Indexes for table `shift_template_instances`
--
ALTER TABLE `shift_template_instances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `squadrons`
--
ALTER TABLE `squadrons`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teams_squadron_id_foreign` (`squadron_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `block_categories`
--
ALTER TABLE `block_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `crew_members`
--
ALTER TABLE `crew_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `flights`
--
ALTER TABLE `flights`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `flight_orders`
--
ALTER TABLE `flight_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `line_instances`
--
ALTER TABLE `line_instances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `line_templates`
--
ALTER TABLE `line_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `qualification_types`
--
ALTER TABLE `qualification_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `shift_line_time_blocks`
--
ALTER TABLE `shift_line_time_blocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shift_templates`
--
ALTER TABLE `shift_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shift_template_instances`
--
ALTER TABLE `shift_template_instances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `block_categories`
--
ALTER TABLE `block_categories`
  ADD CONSTRAINT `block_categories_squadron_id_foreign` FOREIGN KEY (`squadron_id`) REFERENCES `squadrons` (`name`);

--
-- Constraints for table `crew_members`
--
ALTER TABLE `crew_members`
  ADD CONSTRAINT `crew_members_squadron_id_foreign` FOREIGN KEY (`squadron_id`) REFERENCES `squadrons` (`name`);

--
-- Constraints for table `crew_member_shift_line_time_blocks`
--
ALTER TABLE `crew_member_shift_line_time_blocks`
  ADD CONSTRAINT `time_block_id_foreign` FOREIGN KEY (`shift_line_time_block_id`) REFERENCES `shift_line_time_blocks` (`id`);

--
-- Constraints for table `line_templates`
--
ALTER TABLE `line_templates`
  ADD CONSTRAINT `line_templates_aor_id_foreign` FOREIGN KEY (`aor_id`) REFERENCES `aors` (`name`),
  ADD CONSTRAINT `line_templates_line_type_id_foreign` FOREIGN KEY (`line_type_id`) REFERENCES `line_types` (`name`),
  ADD CONSTRAINT `line_templates_squadron_id_foreign` FOREIGN KEY (`squadron_id`) REFERENCES `squadrons` (`name`);

--
-- Constraints for table `qualification_types`
--
ALTER TABLE `qualification_types`
  ADD CONSTRAINT `qualification_types_crew_member_type_id_foreign` FOREIGN KEY (`crew_member_type_id`) REFERENCES `crew_member_types` (`name`);

--
-- Constraints for table `shift_templates`
--
ALTER TABLE `shift_templates`
  ADD CONSTRAINT `shift_templates_squadron_id_foreign` FOREIGN KEY (`squadron_id`) REFERENCES `squadrons` (`name`);

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_squadron_id_foreign` FOREIGN KEY (`squadron_id`) REFERENCES `squadrons` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
