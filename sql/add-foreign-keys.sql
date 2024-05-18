-- Add foreign key constraints.

-- Table types may be changed from MyISAM to InnoDB to support foreign keys.
-- See sql/myisam-to-innodb.sql for the commands to do this.

-- `det_citations_meanings` links citations to meanings: both `citation_id` and `meaning_id` must be valid.
-- Delete any rows that are invalid.
DELETE FROM det_citations_meanings WHERE citation_id NOT IN (SELECT id FROM citation);
DELETE FROM det_citations_meanings WHERE meaning_id NOT IN (SELECT id FROM det_meanings);
-- ==> If a citation is deleted, the corresponding row needs to be deleted.
-- ==> If a meaning is deleted, the corresponding row needs to be deleted.
ALTER TABLE det_citations_meanings
  ADD CONSTRAINT fk_det_citations_meanings_citation_id
  FOREIGN KEY (citation_id) REFERENCES citation(id)
  ON DELETE CASCADE;
ALTER TABLE det_citations_meanings
  ADD CONSTRAINT fk_det_citations_meanings_meaning_id
  FOREIGN KEY (meaning_id) REFERENCES det_meanings(id)
  ON DELETE CASCADE;

-- `det_entries_meanings` is the "See" table: both `entry_id` and `meaning_id` must be valid.
-- Delete any rows that are invalid.
DELETE FROM det_entries_meanings WHERE entry_id NOT IN (SELECT id FROM det_entries);
DELETE FROM det_entries_meanings WHERE meaning_id NOT IN (SELECT id FROM det_meanings);
-- ==> If an entry is deleted, the corresponding row needs to be deleted.
-- ==> If a meaning is deleted, the corresponding row needs to be deleted.
ALTER TABLE det_entries_meanings
  ADD CONSTRAINT fk_det_entries_meanings_entry_id
  FOREIGN KEY (entry_id) REFERENCES det_entries(id)
  ON DELETE CASCADE;
ALTER TABLE det_entries_meanings
  ADD CONSTRAINT fk_det_entries_meanings_meaning_id
  FOREIGN KEY (meaning_id) REFERENCES det_meanings(id)
  ON DELETE CASCADE;

-- TODO: We can't do any of this right now because of duplicate users. We'll
-- need to clean up the database first.
-- `det_entries` must link to a valid `user`: det_entries.proofing_user -> user.email
-- First, create an index on the user table to make email unique.
-- CREATE UNIQUE INDEX user_email ON user(email);
-- ALTER TABLE det_entries
--   ADD CONSTRAINT fk_det_entries_proofing_user
--   FOREIGN KEY (proofing_user) REFERENCES user(id)
--   ON DELETE SET NULL;

-- `det_entries_references` links entries to references: both `entry_id` and `reference_id` must be valid.
-- Change the reference.id column to be an `int`, not `int unsigned`.
ALTER TABLE det_references MODIFY COLUMN id INT AUTO_INCREMENT;
-- Delete any rows that are invalid.
DELETE FROM det_entries_references WHERE entry_id NOT IN (SELECT id FROM det_entries);
DELETE FROM det_entries_references WHERE reference_id NOT IN (SELECT id FROM det_references);
-- ==> If an entry is deleted, the corresponding row needs to be deleted.
-- ==> If a reference is deleted, the corresponding row needs to be deleted.
ALTER TABLE det_entries_references
  ADD CONSTRAINT fk_det_entries_references_entry_id
  FOREIGN KEY (entry_id) REFERENCES det_entries(id)
  ON DELETE CASCADE;
ALTER TABLE det_entries_references
  ADD CONSTRAINT fk_det_entries_references_reference_id
  FOREIGN KEY (reference_id) REFERENCES det_references(id)
  ON DELETE CASCADE;

-- `det_images` must link to a valid `entry`: det_images.entry_id -> entry.id
-- Delete any rows that are invalid.
DELETE FROM det_images WHERE entry_id NOT IN (SELECT id FROM det_entries);
-- ==> If an entry is deleted, the corresponding row needs to be deleted.
ALTER TABLE det_images
  ADD CONSTRAINT fk_det_images_entry_id
  FOREIGN KEY (entry_id) REFERENCES det_entries(id)
  ON DELETE CASCADE;

-- `det_log_entries` must link to a valid `entry`: det_log_entries.entry_id -> entry.id
-- `det_log_entries` must link to a valid `user`: det_log_entries.user_id -> user.id
-- Add a column showing the action that was taken:
ALTER TABLE det_log_entries ADD COLUMN action VARCHAR(255);
ALTER TABLE det_log_entries ADD COLUMN email VARCHAR(200);
-- Delete any rows that are invalid.
DELETE FROM det_log_entries WHERE entry_id NOT IN (SELECT id FROM det_entries);
DELETE FROM det_log_entries WHERE user_id NOT IN (SELECT id FROM user);
-- ==> HOWEVER, on this one, we do NOT just delete the row. We keep the log.
--     Therefore, we need to SET NULL, but this requires a nullable entry_id.
ALTER TABLE det_log_entries MODIFY COLUMN entry_id INT;
ALTER TABLE det_log_entries MODIFY COLUMN user_id INT;
ALTER TABLE det_log_entries
  ADD CONSTRAINT fk_det_log_entries_entry_id
  FOREIGN KEY (entry_id) REFERENCES det_entries(id)
  ON DELETE SET NULL;
ALTER TABLE det_log_entries
  ADD CONSTRAINT fk_det_log_entries_user_id
  FOREIGN KEY (user_id) REFERENCES user(id)
  ON DELETE SET NULL;

-- `det_meanings` must link to a valid `entry`: det_meanings.entry_id -> entry.id
-- Delete any rows that are invalid.
DELETE FROM det_meanings WHERE entry_id NOT IN (SELECT id FROM det_entries);
-- ==> If an entry is deleted, the corresponding row needs to be deleted.
ALTER TABLE det_meanings
  ADD CONSTRAINT fk_det_meanings_entry_id
  FOREIGN KEY (entry_id) REFERENCES det_entries(id)
  ON DELETE CASCADE;



-- `citation` must link to a valid `headword`: citation.headword_id -> headword.id
-- `citation` must link to a valid creation `user`: citation.user_id -> user.id
-- `citation` must link to a valid modification `user`: citation.last_modified_user_id -> user.id
-- `citation` must link to a valid `source`: citation.source_id -> source.id
-- `source` must link to a valid `author`: source.author_id -> author.id
-- `source` must link to a valid `title`: source.title_id -> title.id
-- `source` must link to a valid `place`: source.place_id -> place.id
