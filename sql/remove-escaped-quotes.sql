-- Remove the stray backslash before apostrophes and double quotation marks
-- in the citation data (issue 522): `Longman\'s Green` -> `Longman's Green`,
-- `\"human being\"` -> `"human being"`.
--
-- The backslashes were stored by a 2007 import that escaped quotation marks
-- one time too many. Only a backslash immediately followed by ' or " is
-- removed; any other backslash (Windows paths in source.url, `Bawk\Hagdowns`
-- in one quotation) is left alone.
--
-- Run against one database at a time, e.g.
--   mysql dchp3 < sql/remove-escaped-quotes.sql
-- Each statement is followed by the number of rows it changed. Take a dump
-- first on a database that is not a disposable copy.

SET @bs_apos = CONCAT(CHAR(92), '''');
SET @bs_quot = CONCAT(CHAR(92), '"');

UPDATE citation SET text = REPLACE(REPLACE(text, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(text, @bs_apos) > 0 OR INSTR(text, @bs_quot) > 0;
SELECT 'citation.text' AS col, ROW_COUNT() AS rows_changed;

UPDATE citation SET spelling_variant = REPLACE(REPLACE(spelling_variant, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(spelling_variant, @bs_apos) > 0 OR INSTR(spelling_variant, @bs_quot) > 0;
SELECT 'citation.spelling_variant' AS col, ROW_COUNT() AS rows_changed;

UPDATE citation SET short_meaning = REPLACE(REPLACE(short_meaning, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(short_meaning, @bs_apos) > 0 OR INSTR(short_meaning, @bs_quot) > 0;
SELECT 'citation.short_meaning' AS col, ROW_COUNT() AS rows_changed;

UPDATE citation SET memo = REPLACE(REPLACE(memo, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(memo, @bs_apos) > 0 OR INSTR(memo, @bs_quot) > 0;
SELECT 'citation.memo' AS col, ROW_COUNT() AS rows_changed;

-- citation.clipped_text exists in DCHP-2 and DCHP-3 but not in DCHP-1.
SET @has_clipped = (SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'citation' AND column_name = 'clipped_text');
SET @clip_sql = IF(@has_clipped,
  'UPDATE citation SET clipped_text = REPLACE(REPLACE(clipped_text, @bs_apos, CHAR(39)), @bs_quot, CHAR(34)) WHERE INSTR(clipped_text, @bs_apos) > 0 OR INSTR(clipped_text, @bs_quot) > 0',
  'SELECT 0 INTO @noop');
PREPARE clip FROM @clip_sql;
EXECUTE clip;
SET @clip_rows = ROW_COUNT(); -- read before DEALLOCATE, which resets it
DEALLOCATE PREPARE clip;
SELECT 'citation.clipped_text' AS col, IF(@has_clipped, @clip_rows, NULL) AS rows_changed;

UPDATE title SET name = REPLACE(REPLACE(name, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(name, @bs_apos) > 0 OR INSTR(name, @bs_quot) > 0;
SELECT 'title.name' AS col, ROW_COUNT() AS rows_changed;

UPDATE source SET publisher = REPLACE(REPLACE(publisher, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(publisher, @bs_apos) > 0 OR INSTR(publisher, @bs_quot) > 0;
SELECT 'source.publisher' AS col, ROW_COUNT() AS rows_changed;

UPDATE source SET editor = REPLACE(REPLACE(editor, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(editor, @bs_apos) > 0 OR INSTR(editor, @bs_quot) > 0;
SELECT 'source.editor' AS col, ROW_COUNT() AS rows_changed;

UPDATE source SET page = REPLACE(REPLACE(page, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(page, @bs_apos) > 0 OR INSTR(page, @bs_quot) > 0;
SELECT 'source.page' AS col, ROW_COUNT() AS rows_changed;

UPDATE author SET name = REPLACE(REPLACE(name, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(name, @bs_apos) > 0 OR INSTR(name, @bs_quot) > 0;
SELECT 'author.name' AS col, ROW_COUNT() AS rows_changed;

UPDATE place SET name = REPLACE(REPLACE(name, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(name, @bs_apos) > 0 OR INSTR(name, @bs_quot) > 0;
SELECT 'place.name' AS col, ROW_COUNT() AS rows_changed;

UPDATE headword SET headword = REPLACE(REPLACE(headword, @bs_apos, ''''), @bs_quot, '"')
  WHERE INSTR(headword, @bs_apos) > 0 OR INSTR(headword, @bs_quot) > 0;
SELECT 'headword.headword' AS col, ROW_COUNT() AS rows_changed;
