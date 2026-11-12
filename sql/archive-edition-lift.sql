-- Lift a DCHP-1 or DCHP-2 database dump so the dchp3 codebase can serve it
-- read-only (the archive editions; see docs/editions.md).
--
-- Run against the archive database, after loading the dump and after
-- create-frequency-index.sql (the Frequency Index tables must exist for the
-- Prisma client even though the archive never reaches those routes):
--
--   mysql dchpca_dchp1 < sql/create-frequency-index.sql
--   mysql dchpca_dchp1 -e "SET @edition='dchp1'; SOURCE sql/archive-edition-lift.sql"
--
-- The dumps already carry the det_* columns dchp3 added over the years, so
-- the lift is small: stamp the edition on every entry, and recreate the four
-- views so they are owned by the current user rather than the Bluehost
-- account (`dchpca`@`localhost`) the dump names as their definer, which no
-- longer exists and makes every SELECT on them fail with error 1449.
--
-- The views keep their own definitions (DCHP-1's citation table has `text`
-- where dchp3's has `clipped_text`, and the views already map that to the
-- `citation` column the code reads), so they are re-created from
-- information_schema rather than copied from dchp3.

SET @edition = IFNULL(@edition, 'dchp1');

-- 1. Edition stamp. The search and the entry page read dchp_version; the
--    old apps never set it.
UPDATE det_entries SET dchp_version = @edition WHERE dchp_version IS NULL;

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
