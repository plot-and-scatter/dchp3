-- Lift a DCHP-1 or DCHP-2 database dump so the dchp3 codebase can serve it
-- read-only (the archive editions; see docs/editions.md).
--
-- Run against the archive database after loading the dump, then create the
-- Frequency Index tables (the Prisma client expects them even though the
-- archive never reaches those routes):
--
--   (echo "SET @edition='dchp1';"; cat sql/archive-edition-lift.sql) | mysql dchpca_dchp1
--   mysql dchpca_dchp1 < sql/create-frequency-index.sql
--
-- (Piped rather than `-e "...; SOURCE ..."`: the mysql client exits 1 after
-- a SOURCE given on the command line even when every statement succeeded,
-- which would trip a deploy script.)
--
-- The dumps carry nearly all the det_* columns dchp3 added over the years, so
-- the lift is small: add the few missing ones, stamp the edition on every entry, and recreate the four
-- views so they are owned by the current user rather than the Bluehost
-- account (`dchpca`@`localhost`) the dump names as their definer, which no
-- longer exists and makes every SELECT on them fail with error 1449.
--
-- The views keep their own definitions (DCHP-1's citation table has `text`
-- where dchp3's has `clipped_text`, and the views already map that to the
-- `citation` column the code reads), so they are re-created from
-- information_schema rather than copied from dchp3.

SET @edition = IFNULL(@edition, 'dchp1');

-- 0. Columns dchp3 added after the archive was frozen. The DCHP-1 dump
--    already has all of them; the DCHP-2 dump (dchpca_dchp_2, Feb 2024)
--    lacks det_entries.dchp_version and det_log_entries.action / .email.
--    MySQL 8 has no ADD COLUMN IF NOT EXISTS, so each is guarded through
--    information_schema.
SET @ddl = (SELECT IF(COUNT(*) = 0,
  'ALTER TABLE det_entries ADD COLUMN dchp_version VARCHAR(10) NULL', 'SELECT 1')
  FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_entries' AND COLUMN_NAME = 'dchp_version');
PREPARE c FROM @ddl; EXECUTE c; DEALLOCATE PREPARE c;
SET @ddl = (SELECT IF(COUNT(*) = 0,
  'ALTER TABLE det_log_entries ADD COLUMN action VARCHAR(255) NULL', 'SELECT 1')
  FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_log_entries' AND COLUMN_NAME = 'action');
PREPARE c FROM @ddl; EXECUTE c; DEALLOCATE PREPARE c;
SET @ddl = (SELECT IF(COUNT(*) = 0,
  'ALTER TABLE det_log_entries ADD COLUMN email VARCHAR(255) NULL', 'SELECT 1')
  FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_log_entries' AND COLUMN_NAME = 'email');
PREPARE c FROM @ddl; EXECUTE c; DEALLOCATE PREPARE c;

-- 0b. The Frequency Index tables (create-frequency-index.sql) reference
--     `user` with a foreign key, which needs InnoDB; the 2024 DCHP-2 dump
--     has it as MyISAM. Harmless where it already is InnoDB.
ALTER TABLE `user` ENGINE = InnoDB;

-- 1. Edition stamp. The search and the entry page read dchp_version; the
--    old apps never set it. They did set is_legacy, which in DCHP-2 marks
--    the entries inherited from DCHP-1, so those are stamped dchp1 (as in
--    DCHP-3's own import) and only DCHP-2's own entries dchp2. In DCHP-1
--    every entry is dchp1 whatever the flag says.
UPDATE det_entries
   SET dchp_version = IF(@edition = 'dchp2' AND is_legacy = 1, 'dchp1', @edition)
 WHERE dchp_version IS NULL;

-- 2. Views: re-create each with the same definition and no DEFINER clause,
--    which makes the current user the definer.
SET @view_sql = (SELECT CONCAT('CREATE OR REPLACE SQL SECURITY DEFINER VIEW `det_bibliographies` AS ', VIEW_DEFINITION) FROM information_schema.VIEWS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_bibliographies');
PREPARE v FROM @view_sql; EXECUTE v; DEALLOCATE PREPARE v;
SET @view_sql = (SELECT CONCAT('CREATE OR REPLACE SQL SECURITY DEFINER VIEW `det_citations` AS ', VIEW_DEFINITION) FROM information_schema.VIEWS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_citations');
PREPARE v FROM @view_sql; EXECUTE v; DEALLOCATE PREPARE v;
SET @view_sql = (SELECT CONCAT('CREATE OR REPLACE SQL SECURITY DEFINER VIEW `det_shortcitations` AS ', VIEW_DEFINITION) FROM information_schema.VIEWS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_shortcitations');
PREPARE v FROM @view_sql; EXECUTE v; DEALLOCATE PREPARE v;
SET @view_sql = (SELECT CONCAT('CREATE OR REPLACE SQL SECURITY DEFINER VIEW `det_users` AS ', VIEW_DEFINITION) FROM information_schema.VIEWS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'det_users');
PREPARE v FROM @view_sql; EXECUTE v; DEALLOCATE PREPARE v;
