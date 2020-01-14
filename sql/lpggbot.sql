-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 14. Jan 2020 um 17:31
-- Server-Version: 10.1.38-MariaDB
-- PHP-Version: 7.3.4

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
-- Tabellenstruktur für Tabelle `blacklist`
--

CREATE TABLE `blacklist` (
  `ID` int(50) NOT NULL,
  `server_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `config`
--

CREATE TABLE `config` (
  `ServerID` varchar(20) NOT NULL,
  `Channel` longtext,
  `Moderator` longtext,
  `botlog` varchar(20) DEFAULT NULL,
  `modlog` varchar(20) DEFAULT NULL,
  `blacklist` longtext,
  `automod_channel` longtext,
  `welcome_channel` varchar(20) DEFAULT NULL,
  `welcomemsg` varchar(255) DEFAULT NULL,
  `leaver_channel` varchar(20) DEFAULT NULL,
  `allowedlinks` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `config`
--

INSERT INTO `config` (`ServerID`, `Channel`, `Moderator`, `botlog`, `modlog`, `blacklist`, `automod_channel`, `welcome_channel`, `welcomemsg`, `leaver_channel`, `allowedlinks`) VALUES
('312477482836295681', '562208160329498624,508302049926971392,512005036394414101,312477482836295681,558326372695801877,510386292144472065,610765718899916800,560022599367786507', '239073819787001857,217045776583360512,199131849253978112,369502541811286018,189011299114418176', '562208160329498624', '562208160329498624', '', '562208160329498624', '312477482836295681', '{user} welcome to the server! :)', '562208160329498624', ''),
('581147107033874455', '581147107487121439', NULL, NULL, NULL, NULL, NULL, NULL, '{user} welcome to the server! :)', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `general`
--

CREATE TABLE `general` (
  `ServerID` varchar(20) NOT NULL,
  `ServerName` varchar(100) NOT NULL,
  `Prefix` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `general`
--

INSERT INTO `general` (`ServerID`, `ServerName`, `Prefix`, `active`) VALUES
('312477482836295681', 'LetsPlayGreatGames', '?b', 1),
('581147107033874455', 'testserver', '?b', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `leaver`
--

CREATE TABLE `leaver` (
  `ID` int(50) NOT NULL,
  `ServerID` varchar(20) NOT NULL,
  `leaver_channel` varchar(20) NOT NULL,
  `leaver_msg` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `module`
--

CREATE TABLE `module` (
  `ServerID` varchar(20) CHARACTER SET utf8 NOT NULL,
  `welcome` int(1) DEFAULT '0',
  `leaver` int(1) DEFAULT '0',
  `automod` int(1) DEFAULT '0',
  `linkfilter` int(1) DEFAULT '0',
  `invitefilter` int(1) DEFAULT '0',
  `massmentionfilter` int(1) DEFAULT '0',
  `spamfilter` int(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `module`
--

INSERT INTO `module` (`ServerID`, `welcome`, `leaver`, `automod`, `linkfilter`, `invitefilter`, `massmentionfilter`, `spamfilter`) VALUES
('312477482836295681', 0, 0, 0, 0, 0, 0, 0),
('581147107033874455', 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reactions`
--

CREATE TABLE `reactions` (
  `reactionsID` int(11) NOT NULL,
  `ServerID` varchar(20) CHARACTER SET utf8 NOT NULL,
  `ChannelID` varchar(20) CHARACTER SET utf8 NOT NULL,
  `MessageID` varchar(20) CHARACTER SET utf8 NOT NULL,
  `EmoteID` varchar(255) CHARACTER SET utf8 NOT NULL,
  `RoleID` varchar(20) CHARACTER SET utf8 NOT NULL,
  `ID` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Daten für Tabelle `reactions`
--

INSERT INTO `reactions` (`reactionsID`, `ServerID`, `ChannelID`, `MessageID`, `EmoteID`, `RoleID`, `ID`) VALUES
(141, '312477482836295681', '345460061302423552', '590446700259311616', '0bi', '425584194522054656', '3454600613024235525904467002593116160bi425584194522054656'),
(164, '312477482836295681', '610768275026083846', '610775848336752661', '1-2sn', '514469437420601385', '6107682750260838466107758483367526611-2sn514469437420601385'),
(165, '312477482836295681', '610768275026083846', '610775848336752661', '2-2sn', '606809178165608458', '6107682750260838466107758483367526612-2sn606809178165608458'),
(166, '312477482836295681', '537541284345282561', '611808155025801219', '1-2sn', '599588842634215436', '5375412843452825616118081550258012191-2sn599588842634215436'),
(167, '312477482836295681', '537541284345282561', '611808155025801219', '2-2sn', '599588673540849680', '5375412843452825616118081550258012192-2sn599588673540849680'),
(168, '312477482836295681', '537541284345282561', '615183936196313129', 'h77hc', '510359966566055937', '537541284345282561615183936196313129h77hc510359966566055937'),
(169, '312477482836295681', '537541284345282561', '615183936196313129', 'w77hd', '510360146069815296', '537541284345282561615183936196313129w77hd510360146069815296'),
(170, '312477482836295681', '537541284345282561', '615184029142089748', '1-2sn', '599588842634215436', '5375412843452825616151840291420897481-2sn599588842634215436'),
(171, '312477482836295681', '537541284345282561', '615184029142089748', '2-2sn', '599588673540849680', '5375412843452825616151840291420897482-2sn599588673540849680'),
(172, '312477482836295681', '537541284345282561', '615184115813318667', '1-2sn', '551454381304971275', '5375412843452825616151841158133186671-2sn551454381304971275'),
(173, '312477482836295681', '537541284345282561', '615184219211038720', 'nv8h', '514051206109331466', '537541284345282561615184219211038720nv8h514051206109331466'),
(174, '312477482836295681', '537541284345282561', '615184340535476234', '<:cookie:550030576770482186>-', '509793104165863436', '537541284345282561615184340535476234<:cookie:550030576770482186>-509793104165863436'),
(175, '312477482836295681', '537541284345282561', '615184340535476234', '<:PogChamp:451999772015067136>-', '533299212964593664', '537541284345282561615184340535476234<:PogChamp:451999772015067136>-533299212964593664'),
(176, '312477482836295681', '537541284345282561', '615184340535476234', '<:CoolPanda:549009877939388417>-', '551750512140353567', '537541284345282561615184340535476234<:CoolPanda:549009877939388417>-551750512140353567'),
(177, '312477482836295681', '537541284345282561', '615184340535476234', '<:wuhuu:549011842249261056>-', '551753232439967765', '537541284345282561615184340535476234<:wuhuu:549011842249261056>-551753232439967765'),
(178, '312477482836295681', '537541284345282561', '615184340535476234', '<:HappyPepe:558266528869384225>-', '583715562463428643', '537541284345282561615184340535476234<:HappyPepe:558266528869384225>-583715562463428643'),
(179, '312477482836295681', '537541284345282561', '615184340535476234', '2q9h', '592719967733153802', '5375412843452825616151843405354762342q9h592719967733153802'),
(180, '312477482836295681', '537541284345282561', '615184340535476234', '7o8h', '605748291141107712', '5375412843452825616151843405354762347o8h605748291141107712'),
(181, '312477482836295681', '537541284345282561', '615184115813318667', '2-2sn', '610771918924283917', '5375412843452825616151841158133186672-2sn610771918924283917');

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
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `blacklist_general` (`server_id`);

--
-- Indizes für die Tabelle `config`
--
ALTER TABLE `config`
  ADD UNIQUE KEY `ServerID_2` (`ServerID`),
  ADD KEY `ServerID` (`ServerID`);

--
-- Indizes für die Tabelle `general`
--
ALTER TABLE `general`
  ADD PRIMARY KEY (`ServerID`);

--
-- Indizes für die Tabelle `leaver`
--
ALTER TABLE `leaver`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `leaver_general` (`ServerID`);

--
-- Indizes für die Tabelle `module`
--
ALTER TABLE `module`
  ADD UNIQUE KEY `ServerID` (`ServerID`);

--
-- Indizes für die Tabelle `reactions`
--
ALTER TABLE `reactions`
  ADD UNIQUE KEY `reactionsID` (`reactionsID`),
  ADD UNIQUE KEY `ID` (`ID`),
  ADD KEY `reactions_general` (`ServerID`),
  ADD KEY `reactionsID_2` (`reactionsID`);

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
-- AUTO_INCREMENT für Tabelle `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `ID` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `leaver`
--
ALTER TABLE `leaver`
  MODIFY `ID` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `reactions`
--
ALTER TABLE `reactions`
  MODIFY `reactionsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;

--
-- AUTO_INCREMENT für Tabelle `welcome`
--
ALTER TABLE `welcome`
  MODIFY `ID` int(50) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `blacklist`
--
ALTER TABLE `blacklist`
  ADD CONSTRAINT `blacklist_general` FOREIGN KEY (`server_id`) REFERENCES `general` (`ServerID`);

--
-- Constraints der Tabelle `config`
--
ALTER TABLE `config`
  ADD CONSTRAINT `config_general` FOREIGN KEY (`ServerID`) REFERENCES `general` (`ServerID`);

--
-- Constraints der Tabelle `leaver`
--
ALTER TABLE `leaver`
  ADD CONSTRAINT `leaver_general` FOREIGN KEY (`ServerID`) REFERENCES `general` (`ServerID`);

--
-- Constraints der Tabelle `module`
--
ALTER TABLE `module`
  ADD CONSTRAINT `module_general` FOREIGN KEY (`ServerID`) REFERENCES `general` (`ServerID`);

--
-- Constraints der Tabelle `reactions`
--
ALTER TABLE `reactions`
  ADD CONSTRAINT `reactions_general` FOREIGN KEY (`ServerID`) REFERENCES `general` (`ServerID`);

--
-- Constraints der Tabelle `welcome`
--
ALTER TABLE `welcome`
  ADD CONSTRAINT `welcome_general` FOREIGN KEY (`ServerID`) REFERENCES `general` (`ServerID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
