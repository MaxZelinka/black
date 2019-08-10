-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 10. Aug 2019 um 15:09
-- Server-Version: 10.1.39-MariaDB
-- PHP-Version: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `lpggbot`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `welcome`
--

CREATE TABLE `welcome` (
  `ID` int(50) NOT NULL,
  `ServerID` varchar(20) NOT NULL,
  `welcome_channel` varchar(20) DEFAULT NULL,
  `welcome_msg` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `welcome`
--

INSERT INTO `welcome` (`ID`, `ServerID`, `welcome_channel`, `welcome_msg`) VALUES
(3, '312477482836295681', '562208160329498624', NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `welcome`
--
ALTER TABLE `welcome`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `welcome_general` (`ServerID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `welcome`
--
ALTER TABLE `welcome`
  MODIFY `ID` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `welcome`
--
ALTER TABLE `welcome`
  ADD CONSTRAINT `welcome_general` FOREIGN KEY (`ServerID`) REFERENCES `general` (`ServerID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
