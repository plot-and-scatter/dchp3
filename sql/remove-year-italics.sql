-- Remove literal <i>…</i> tags from citation year fields.
--
-- The legacy data marked "circa" and "ante" years as <i>c</i>1902 and
-- <i>a</i>1820. The year fields are rendered as plain text, so the tags
-- showed up verbatim in entries (for example the X.Y. entry). The editorial
-- team asked for the tags to be removed, leaving c1902 and a1820, which is
-- how the few hand-corrected rows already read.
--
-- Only source.year_published / year_composed need changing: det_citations,
-- which the entry pages read, is a view over citation and source. Stray
-- fragments such as "</i>1937" and a leading space are cleaned up by the
-- same replacement plus TRIM.
--
-- Run against one database at a time:
--   mysql -u USER -p DATABASE < sql/remove-year-italics.sql
-- Prints rows changed per column. Expected on the 2026-11-13 copies:
-- year_published 51, year_composed 158 (DCHP-3) or 159 (DCHP-1, DCHP-2).

UPDATE source
SET year_published = TRIM(REPLACE(REPLACE(year_published, '<i>', ''), '</i>', ''))
WHERE year_published LIKE '%<%' OR year_published LIKE '%>%';
SELECT 'source.year_published' AS col, ROW_COUNT() AS rows_changed;

UPDATE source
SET year_composed = TRIM(REPLACE(REPLACE(year_composed, '<i>', ''), '</i>', ''))
WHERE year_composed LIKE '%<%' OR year_composed LIKE '%>%';
SELECT 'source.year_composed' AS col, ROW_COUNT() AS rows_changed;

-- Anything with angle brackets left over (expected: none).
SELECT 'leftover' AS what, yearpub, yearcomp FROM det_citations
WHERE yearpub LIKE '%<%' OR yearcomp LIKE '%<%' OR yearpub LIKE '%>%' OR yearcomp LIKE '%>%';
