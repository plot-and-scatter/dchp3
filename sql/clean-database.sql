-- Script to replace common errors with quotes, etc.

-- Find anything without an ASCII character. Note, this will still find
-- correctly accented characters.
select * from headword WHERE headword <> convert(headword using ascii);

-- Do updates.
update headword set headword = replace(headword, 'Ã©', 'é');
update headword set headword = replace(headword, 'Ã»', 'û');
update headword set headword = replace(headword, 'â€™', '’');
update headword set headword = replace(headword, 'Ã³', 'ó');

-- We can't blanket replace "Ãª" because it matches "aa" by default.
update headword set headword = "Fête nationale" where headword like "FÃªte nationale"

-- Set all users to inactive. If/when they log in via Auth0 we will reset them
-- to active.
update user set is_active = 0

-- Update the timestamps to prevent errors with '0000-00-00 00:00:00'
set sql_mode=(select replace(@@sql_mode,"NO_ZERO_DATE", ""));
update citation set last_modified = null WHERE last_modified = '0000-00-00 00:00:00';


-- AUTHOR table
-- * Remove is_dchp1 and is_teach flags.
-- * [Eventually]: Merge all authors with the same name.

-- CITATION table
-- * Remove is_dchp1 and is_teach flags.

-- DET_CITATIONS_MEANINGS table:
-- * Remove any rows where either the meaning_id or citation_id are orphans.

-- DET_ENTRIES table:
-- * [Investigate]: what is the `first_field` column for?
-- * Remove the is_legacy column; we are now keeping track of this in the dchp_version column.
-- * [Investigate]: what is the `superscript` column for?
-- * Rename `proofing_user` to `creation_user_email`.
-- * Remove the `image_file_name` column.
-- * [Investigate]: are we using the `proofing_status` column?

-- DET_ENTRIES_MEANINGS table:
-- * Remove any rows where either the meaning_id or entry_id are orphans.

-- DET_ENTRIES_REFERENCES table:
-- * Remove any rows where either the entry_id or reference_id are orphans.
-- * How to incorporate the sv_text column into the app?

-- DET_IMAGES table:
-- * Remove any rows where the entry_id is an orphan.
-- * [Investigate]: We're not using the `scale` column and can probably delete.

-- DET_IPS table:
-- * This can be removed; it's empty.

-- DET_LOG_ENTRIES table:
-- * Remove any rows where the entry_id or user_id are orphans.
-- * [Investigate]: what is the `headword` column for? It's completely null.

-- DET_MEANINGS table:
-- * Remove any rows where the entry_id is an orphan.
-- * [Investigate]: can we remove the `headword` column? Not used?
-- * [Investigate]: can we remove the `ordernum` and `orderletter` columns? It
--   seems we are using the `order` column instead.

-- DET_REFERENCES table:
-- * No changes required.

-- DET_USAGE_NOTES table:
-- * Remove any rows where the meaning_id is an orphan.

-- DET_USER_SESSIONS table:
-- * Can be removed altogether; Auth0 is now handling this for us.

-- HEADWORD table:
-- * Remove is_dchp1 and is_teach flags.
-- * Check to see if there are any duplicate headwords (there should not be).

-- PLACE table:
-- * Remove is_dchp1 and is_teach flags.
-- * [Eventually]: Merge all places with the same name.

-- SDT_-prefixed tables: [Investigate]: Can we remove these?

-- SOURCE table:
-- * Remove is_dchp1 and is_teach flags.

-- TITLE table:
-- * Remove is_dchp1 and is_teach flags.
-- * [Eventually]: Merge all titles with the same name.
-- * [Investigate]: what is the `short_name` column for? It's completely null.

-- USER table:
-- * Remove is_dchp1 flag.
-- * Remove password and password_key columns (Auth0 handles this for us now).
-- * Remove access_level column (handled via Auth0 roles).
-- * Remove users according to the criteria below:

-- * Remove all users who are not attached to any entries or citations.
-- * Check:
--     * citation.last_modified_user_id
--     * citation.user_id
--     * det_log_entries.user_id
--     * det_entries.proofing_user
