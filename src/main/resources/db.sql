CREATE DATABASE IF NOT EXISTS `jpa_onetomany`;
USE `jpa_onetomany`;

DROP TABLE IF EXISTS `Employee`;
CREATE TABLE `employee`(
  `employee_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `version` int(11) unsigned DEFAULT 0
)ENGINE = InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Shift`;
CREATE TABLE `shift`(
  `shift_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `employee_id` BIGINT REFERENCES employee(employee_id),
  `name` varchar(255)  DEFAULT NULL,
  `date` DATE DEFAULT NULL,
  `time` VARCHAR(10) DEFAULT NULL,
  `version` int(11) unsigned DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET=utf8;