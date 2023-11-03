-- Script to replace common errors with quotes, etc.

-- Find anything without an ASCII character. Note, this will still find
-- correctly accented characters.
select * from headword WHERE headword <> convert(headword using ascii);

-- Do updates.
update headword set headword = replace(headword, 'Ã©', 'é');
update headword set headword = replace(headword, 'Ã»', 'û');
update headword set headword = replace(headword, 'â€™', '’');

-- We can't blanket replace "Ãª" because it matches "aa" by default.
update headword set headword = "Fête nationale" where headword like "FÃªte nationale"
