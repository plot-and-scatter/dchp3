-- Add foreign key constraints.

-- `citation` must link to a valid `headword`: citation.headword_id -> headword.id
-- `citation` must link to a valid creation `user`: citation.user_id -> user.id
-- `citation` must link to a valid modification `user`: citation.last_modified_user_id -> user.id
-- `citation` must link to a valid `source`: citation.source_id -> source.id
-- `source` must link to a valid `author`: source.author_id -> author.id
-- `source` must link to a valid `title`: source.title_id -> title.id
-- `source` must link to a valid `place`: source.place_id -> place.id
