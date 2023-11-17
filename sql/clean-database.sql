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
